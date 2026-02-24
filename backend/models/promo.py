from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base
import datetime

class Promo(Base):
    __tablename__ = "promos"
    id = Column(Integer, primary_key=True, index=True)
    icon = Column(String, default="Tag")          # lucide icon name string
    text = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
