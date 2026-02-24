from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class ProductBase(BaseModel):
    name: str
    price: float
    original_price: Optional[float] = None
    rating: float = 0.0
    image_url: Optional[str] = None
    category: str
    description: Optional[str] = None
    stock: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    rating: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    stock: Optional[int] = None

class ProductImage(BaseModel):
    id: int
    image_url: str
    model_config = ConfigDict(from_attributes=True)

class Product(ProductBase):
    id: int
    images: List[ProductImage] = []
    model_config = ConfigDict(from_attributes=True)
