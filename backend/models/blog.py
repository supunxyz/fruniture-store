from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from database import Base
import datetime

class BlogPost(Base):
    __tablename__ = "blog_posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    author = Column(String, default="Admin")
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
