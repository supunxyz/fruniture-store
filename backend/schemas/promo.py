from pydantic import BaseModel, ConfigDict
from typing import Optional

class PromoCreate(BaseModel):
    icon: Optional[str] = "Tag"
    text: str
    is_active: Optional[bool] = True
    sort_order: Optional[int] = 0

class PromoUpdate(BaseModel):
    icon: Optional[str] = None
    text: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None

class Promo(BaseModel):
    id: int
    icon: str
    text: str
    is_active: bool
    sort_order: int
    model_config = ConfigDict(from_attributes=True)
