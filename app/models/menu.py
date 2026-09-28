from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    establishment_id = Column(Integer, ForeignKey("establishments.id")) # Зв'язок з рестораном
    name = Column(String, index=True)          # Назва страви (напр., Свинячі ребра)
    description = Column(String, nullable=True) # Опис (інгредієнти)
    price = Column(Float)                      # Ціна в грн
    image_url = Column(String, nullable=True)  # Фото страви

    # 🌟 ОБОВ'ЯЗКОВО ДОДАЄМО СЮДИ: Нова колонка для групування страв за категоріями у меню
    category = Column(String, default="Основні страви", nullable=True)

    # Зворотний зв'язок: кожна страва знає свій ресторан
    establishment = relationship("Establishment", back_populates="menu_items")
