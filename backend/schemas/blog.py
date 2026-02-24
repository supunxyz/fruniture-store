from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class BlogPostBase(BaseModel):
    title: str
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = "Admin"
    is_published: Optional[bool] = True

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    is_published: Optional[bool] = None

class BlogPost(BlogPostBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
