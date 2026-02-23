from sqlalchemy import Column, Integer, String, Float
from database import Base

class HeroSection(Base):
    __tablename__ = "hero_section"
    id = Column(Integer, primary_key=True, index=True)
    title_black = Column(String, default="Ergonomic")
    title_colored = Column(String, default="Monitor")
    title_black_2 = Column(String, default="Stand")
    subtitle = Column(String, default="Elevate your workspace with our premium wood monitor desk stand. Designed to improve posture and elegantly organize your essential accessories.")
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=85)
    current_price = Column(Float, default=65.0)
    old_price = Column(Float, default=99.0)
    image_url = Column(String, default="/assets/monitor_stand.png")
