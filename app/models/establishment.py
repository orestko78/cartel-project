from sqlalchemy import Column, Integer, String, Float, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Establishment(Base):
    __tablename__ = "establishments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    type = Column(String)  # Restaurant або Hotel
    cuisine = Column(String, nullable=True)
    location = Column(String, default="Bukovel")
    rating = Column(Float, default=5.0)
    image_url = Column(String, nullable=True)  # Залишаємо для сумісності з одним фото
    images = Column(JSON, nullable=True)       # НОВЕ ПОЛЕ ДЛЯ МАСИВУ ФОТОГРАФІЙ (СЛАЙДЕРА)
    
    # Поле для довгого техаського та інших текстів
    description = Column(String, nullable=True)
    
    # 🌟 ОБОВ'ЯЗКОВО ДОДАЄМО СЮДИ: Поле для збереження HTML-коду вбудованої карти Google
    map_iframe = Column(String, nullable=True)

    # Зворотний зв'язок: кожен ресторан знає свої страви
    menu_items = relationship("MenuItem", back_populates="establishment", cascade="all, delete-orphan")
