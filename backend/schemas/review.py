from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    rating: float
    comment: Optional[str] = None

    @field_validator('rating')
    @classmethod
    def rating_must_be_valid(cls, v):
        if not (1 <= v <= 5):
            raise ValueError('Rating must be between 1 and 5')
        # Round to nearest 0.5
        return round(v * 2) / 2

class ReviewAuthor(BaseModel):
    id: int
    username: str
    profile_picture: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class Review(BaseModel):
    id: int
    product_id: int
    user_id: int
    rating: float
    comment: Optional[str] = None
    created_at: datetime
    user: Optional[ReviewAuthor] = None
    model_config = ConfigDict(from_attributes=True)
