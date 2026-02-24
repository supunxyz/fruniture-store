from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    profile_picture = Column(String, nullable=True)
    billing_address = Column(String, nullable=True)
    payment_card = Column(String, nullable=True)
    orders = relationship("Order", back_populates="owner")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
