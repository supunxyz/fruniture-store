from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/api/reviews",
    tags=["reviews"]
)

def _recalculate_product_rating(db: Session, product_id: int):
    """Recompute and persist the average rating on the product."""
    reviews = db.query(models.Review).filter(models.Review.product_id == product_id).all()
    if reviews:
        avg = sum(r.rating for r in reviews) / len(reviews)
        avg = round(avg * 10) / 10  # 1 decimal place
    else:
        avg = 0.0
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product:
        product.rating = avg
        db.commit()


@router.get("/product/{product_id}", response_model=List[schemas.Review])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.Review)
        .options(joinedload(models.Review.user))
        .filter(models.Review.product_id == product_id)
        .order_by(models.Review.created_at.desc())
        .all()
    )


@router.post("/product/{product_id}", response_model=schemas.Review, status_code=201)
def create_review(
    product_id: int,
    review_data: schemas.ReviewCreate,
    user_id: int,      # passed as query param from frontend (replace with JWT later)
    db: Session = Depends(get_db)
):
    # Ensure product exists
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Ensure user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # One review per user per product
    existing = (
        db.query(models.Review)
        .filter(models.Review.product_id == product_id, models.Review.user_id == user_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")

    review = models.Review(
        product_id=product_id,
        user_id=user_id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    _recalculate_product_rating(db, product_id)

    # Return review with user loaded
    return (
        db.query(models.Review)
        .options(joinedload(models.Review.user))
        .filter(models.Review.id == review.id)
        .first()
    )


@router.delete("/{review_id}", status_code=204)
def delete_review(review_id: int, user_id: int, db: Session = Depends(get_db)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")

    product_id = review.product_id
    db.delete(review)
    db.commit()
    _recalculate_product_rating(db, product_id)
