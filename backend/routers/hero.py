from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
import models.hero as hero_model
import schemas.hero as hero_schema
from services.storage_service import upload_file

router = APIRouter(
    prefix="/api/hero",
    tags=["hero"]
)

@router.get("/", response_model=hero_schema.HeroSection)
def get_hero(db: Session = Depends(get_db)):
    hero = db.query(hero_model.HeroSection).first()
    if not hero:
        # Create a default hero if it doesn't exist
        hero = hero_model.HeroSection(
            title_black="Ergonomic",
            title_colored="Monitor",
            title_black_2="Stand",
            subtitle="Elevate your workspace with our premium wood monitor desk stand. Designed to improve posture and elegantly organize your essential accessories.",
            rating=4.8,
            reviews_count=85,
            current_price=65.0,
            old_price=99.0,
            image_url="/assets/monitor_stand.png"
        )
        db.add(hero)
        db.commit()
        db.refresh(hero)
    return hero

@router.put("/{hero_id}", response_model=hero_schema.HeroSection)
def update_hero(hero_id: int, hero_update: hero_schema.HeroSectionCreate, db: Session = Depends(get_db)):
    hero = db.query(hero_model.HeroSection).filter(hero_model.HeroSection.id == hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero section not found")
    
    update_data = hero_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(hero, key, value)
        
    db.commit()
    db.refresh(hero)
    return hero

@router.post("/{hero_id}/image", response_model=hero_schema.HeroSection)
def upload_hero_image(hero_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    hero = db.query(hero_model.HeroSection).filter(hero_model.HeroSection.id == hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero section not found")
    
    image_url = upload_file(file, prefix="hero")
    hero.image_url = image_url
    db.commit()
    db.refresh(hero)
    return hero
