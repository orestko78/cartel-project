from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.establishment import Establishment
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/establishments",
    tags=["Establishments (Заклади)"]
)

class EstablishmentCreate(BaseModel):
    name: str
    type: str
    cuisine: str | None = None
    location: str = "Bukovel"
    rating: float = 5.0
    image_url: str | None = None  # <-- Додаємо в схему валідації

@router.post("/", response_model=EstablishmentCreate)
def create_establishment(item: EstablishmentCreate, db: Session = Depends(get_db)):
    db_item = db.query(Establishment).filter(Establishment.name == item.name).first()
    if db_item:
        raise HTTPException(status_code=400, detail="Заклад з такою назвою вже існує")
    
    new_establishment = Establishment(
        name=item.name,
        type=item.type,
        cuisine=item.cuisine,
        location=item.location,
        rating=item.rating,
        image_url=item.image_url  # <-- Зберігаємо фото в базу
    )
    db.add(new_establishment)
    db.commit()
    db.refresh(new_establishment)
    return new_establishment

@router.get("/")
def get_establishments(db: Session = Depends(get_db)):
    return db.query(Establishment).all()