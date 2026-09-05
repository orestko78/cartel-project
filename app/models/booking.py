from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    establishment_name = Column(String, index=True)  # До якого закладу йдуть
    guest_name = Column(String)                      # Ім'я гостя
    guest_phone = Column(String)                     # Номер телефону
    booking_date = Column(String)                    # Дата та час візиту
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # Коли залишили заявку