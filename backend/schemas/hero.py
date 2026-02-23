from pydantic import BaseModel
from typing import Optional

class HeroSectionBase(BaseModel):
    title_black: Optional[str] = None
    title_colored: Optional[str] = None
    title_black_2: Optional[str] = None
    subtitle: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    current_price: Optional[float] = None
    old_price: Optional[float] = None
    image_url: Optional[str] = None

class HeroSectionCreate(HeroSectionBase):
    pass

class HeroSection(HeroSectionBase):
    id: int

    class Config:
        from_attributes = True
