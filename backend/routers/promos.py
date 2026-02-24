from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/promos", tags=["promos"])

DEFAULT_PROMOS = [
    {"icon": "Truck",        "text": "Free Shipping on orders over $500",            "sort_order": 0},
    {"icon": "BadgePercent", "text": "20% Off All Sofas This Week",                  "sort_order": 1},
    {"icon": "Gift",         "text": "Buy 2 Get 1 Free on Cushions & Pillows",       "sort_order": 2},
    {"icon": "Clock",        "text": "Flash Sale — Ends Tonight at Midnight",        "sort_order": 3},
    {"icon": "Sparkles",     "text": "New Arrivals: Scandinavian Collection",        "sort_order": 4},
    {"icon": "Tag",          "text": "Use code FURNISH15 for 15% off your first order", "sort_order": 5},
    {"icon": "Zap",          "text": "Clearance: Up to 50% Off Selected Items",     "sort_order": 6},
    {"icon": "Truck",        "text": "Same-Day Delivery available in select cities", "sort_order": 7},
]

def seed_defaults(db: Session):
    """Seed default promos if none exist."""
    if db.query(models.Promo).count() == 0:
        for p in DEFAULT_PROMOS:
            db.add(models.Promo(**p))
        db.commit()


@router.get("/", response_model=List[schemas.Promo])
def get_promos(db: Session = Depends(get_db)):
    seed_defaults(db)
    return (
        db.query(models.Promo)
        .filter(models.Promo.is_active == True)
        .order_by(models.Promo.sort_order)
        .all()
    )


@router.get("/all", response_model=List[schemas.Promo])
def get_all_promos(db: Session = Depends(get_db)):
    """Admin: fetch every promo (active + inactive)."""
    seed_defaults(db)
    return db.query(models.Promo).order_by(models.Promo.sort_order).all()


@router.post("/", response_model=schemas.Promo, status_code=201)
def create_promo(promo: schemas.PromoCreate, db: Session = Depends(get_db)):
    # Auto-assign sort_order at the end
    max_order = db.query(models.Promo).count()
    new_promo = models.Promo(**promo.model_dump(), sort_order=promo.sort_order if promo.sort_order else max_order)
    db.add(new_promo)
    db.commit()
    db.refresh(new_promo)
    return new_promo


@router.put("/{promo_id}", response_model=schemas.Promo)
def update_promo(promo_id: int, data: schemas.PromoUpdate, db: Session = Depends(get_db)):
    promo = db.query(models.Promo).filter(models.Promo.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo not found")
    for field, val in data.model_dump(exclude_unset=True).items():
        setattr(promo, field, val)
    db.commit()
    db.refresh(promo)
    return promo


@router.delete("/{promo_id}", status_code=204)
def delete_promo(promo_id: int, db: Session = Depends(get_db)):
    promo = db.query(models.Promo).filter(models.Promo.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo not found")
    db.delete(promo)
    db.commit()
