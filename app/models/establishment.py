
from sqlalchemy import Column, Integer, String, Float
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
    image_url = Column(String, nullable=True)  # <-- НОВЕ ПОЛЕ ДЛЯ ПОСИЛАННЯ НА ФОТО

    # Зворотний зв'язок: кожен ресторан знає свої страви
    menu_items = relationship("MenuItem", back_populates="establishment", cascade="all, delete-orphan")  # <-- Додано cascade для видалення страв при видаленні ресторану