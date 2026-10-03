from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.establishment import Establishment
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/establishments",
    tags=["Establishments (Заклади)"]
)

# 1. ОНОВЛЕНА СХЕМА СТВОРЕННЯ/РЕДАГУВАННЯ ЗАКЛАДУ (Замінили description на два мовних поля)
class EstablishmentCreate(BaseModel):
    name: str
    type: str
    cuisine: str | None = None
    location_uk: str = "Буковель"
    location_en: str = "Bukovel"
    rating: float = 5.0
    image_url: str | None = None
    images: list[str] | None = None  # Поле для масиву фотографій
    
    # 🌟 МУЛЬТИМОВНИЙ ФІКС: Окремі поля для українського та англійського описів
    description_uk: str | None = None  
    description_en: str | None = None  
    
    map_iframe: str | None = None

# Схема для відповіді клієнту, яка включає ID з бази даних
class EstablishmentResponse(EstablishmentCreate):
    id: int

    class Config:
        from_attributes = True  # Для сумісності зі SQLAlchemy (в Pydantic v2)


# 2. ЕНДПОЇНТ СТВОРЕННЯ ЗАКЛАДУ (POST)
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
        
        # 🌟 ПЕРЕДАЄМО ОБИДВА ОПИСИ В МОДЕЛЬ ДЛЯ ЗАПИСУ В БД
        description_uk=item.description_uk,
        description_en=item.description_en,
        
        map_iframe=item.map_iframe
    )
    db.add(new_establishment)
    db.commit()
    db.refresh(new_establishment)
    return new_establishment


# 3. ЕНДПОЇНТ ОТРИМАННЯ ВСІХ ЗАКЛАДІВ (GET)
@router.get("/", response_model=list[EstablishmentResponse])
def get_establishments(db: Session = Depends(get_db)):
    return db.query(Establishment).all()


# 4. ЕНДПОЇНТ ДЛЯ СТОРІНКИ ДЕТАЛЕЙ (GET за ID)
@router.get("/{establishment_id}", response_model=EstablishmentResponse)
def get_establishment_by_id(establishment_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Establishment).filter(Establishment.id == establishment_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Заклад не знайдено")
    return db_item


# 5. ЕНДПОЇНТ ВИДАЛЕННЯ ЗАКЛАДУ (DELETE)
@router.delete("/{establishment_id}")
def delete_establishment(establishment_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Establishment).filter(Establishment.id == establishment_id).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Заклад не знайдено")
    
    db.delete(db_item)
    db.commit()
    
    return {"message": f"Establishment {establishment_id} deleted successfully"}


# 6. ЕНДПОЇНТ РЕДАГУВАННЯ ЗАКЛАДУ (PUT)
@router.put("/{establishment_id}", response_model=EstablishmentResponse)
def update_establishment(establishment_id: int, item: EstablishmentCreate, db: Session = Depends(get_db)):
    db_item = db.query(Establishment).filter(Establishment.id == establishment_id).first()
    
    if not db_item:
        raise HTTPException(status_code=404, detail="Заклад не знайдено")
    
    # Оновлюємо кожне поле новими даними, які ви введете в Swagger
    db_item.name = item.name
    db_item.type = item.type
    db_item.cuisine = item.cuisine
    db_item.location = item.location
    db_item.rating = item.rating
    db_item.image_url = item.image_url
    db_item.images = item.images
    
    # 🌟 ОНОВЛЮЄМО МУЛЬТИМОВНІ ОПИСИ ЧЕРЕЗ PUT
    db_item.description_uk = item.description_uk
    db_item.description_en = item.description_en
    
    db_item.map_iframe = item.map_iframe
    
    db.commit()
    db.refresh(db_item)
    return db_item
