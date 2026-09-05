from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.booking import Booking
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/bookings",
    tags=["Bookings (Бронювання)"]
)

class BookingCreate(BaseModel):
    establishment_name: str
    guest_name: str
    guest_phone: str
    booking_date: str

@router.post("/")
def create_booking(item: BookingCreate, db: Session = Depends(get_db)):
    if not item.guest_name or not item.guest_phone:
        raise HTTPException(status_code=400, detail="Будь ласка, заповніть усі поля")
        
    new_booking = Booking(
        establishment_name=item.establishment_name,
        guest_name=item.guest_name,
        guest_phone=item.guest_phone,
        booking_date=item.booking_date
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return {"status": "success", "message": f"Дякуємо, {item.guest_name}! Бронювання прийнято."}

@router.get("/")
def get_all_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).all()

# 🔥 НОВИЙ ЕНДПОЇНТ ДЛЯ ВИДАЛЕННЯ БРОНЮВАННЯ ЗА ЙОГО ID
@router.delete("/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Бронювання не знайдено")
    
    db.delete(booking)
    db.commit()
    return {"status": "success", "message": f"Бронювання #{booking_id} успішно видалено"}