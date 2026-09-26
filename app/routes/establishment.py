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
    image_url: str | None = None
    images: list[str] | None = None  # Поле для масиву фотографій
    description: str | None = None  # Поле для довгого техаського та інших текстів
    
    # 🌟 1. ДОБАВЛЕНО СЮДА: Поле для хранения HTML-кода карты Google
    map_iframe: str | None = None

# Схема для відповіді клієнту, яка включає ID з бази даних
class EstablishmentResponse(EstablishmentCreate):
    id: int

    class Config:
        from_attributes = True # Для сумісності зі SQLAlchemy (в Pydantic v2)

@router.post("/", response_model=EstablishmentResponse)
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
        image_url=item.image_url,
        images=item.images,
        description=item.description,
        
        # 🌟 2. ДОБАВЛЕНО СЮДА: Передаем код карты в модель SQLAlchemy для записи в базу
        map_iframe=item.map_iframe
    )
    db.add(new_establishment)
    db.commit()
    db.refresh(new_establishment)
    return new_establishment

@router.get("/", response_model=list[EstablishmentResponse])
def get_establishments(db: Session = Depends(get_db)):
    return db.query(Establishment).all()

@router.delete("/{establishment_id}")
def delete_establishment(establishment_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Establishment).filter(Establishment.id == establishment_id).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Заклад не знайдено")
    
    db.delete(db_item)
    db.commit()
    
    return {"message": f"Establishment {establishment_id} deleted successfully"}
