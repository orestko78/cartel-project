from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.menu import MenuItem
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/menu",
    tags=["Menu Items (Меню страв)"]
)

# 🌟 1. СХЕМА ДЛЯ СТВОРЕННЯ: Тепер офіційно включає категорію для Swagger API
class MenuItemCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    image_url: str | None = None
    category: str | None = "Основні страви"  # За замовчуванням ставимо базовий розділ

# Схема для відповіді клієнту (включає унікальний ID з бази даних)
class MenuItemResponse(MenuItemCreate):
    id: int
    establishment_id: int

    class Config:
        from_attributes = True  # Для сумісності зі SQLAlchemy (Pydantic v2)

# Ендпоінт для додавання нової страви до конкретного закладу
@router.post("/{establishment_id}", response_model=MenuItemResponse)
def create_menu_item(establishment_id: int, item: MenuItemCreate, db: Session = Depends(get_db)):
    new_dish = MenuItem(
        establishment_id=establishment_id,
        name=item.name,
        description=item.description,
        price=item.price,
        image_url=item.image_url,
        # 🌟 2. ПЕРЕДАЄМО КАТЕГОРІЮ В МОДЕЛЬ: записуємо значення з Swagger в базу даних
        category=item.category
    )
    db.add(new_dish)
    db.commit()
    db.refresh(new_dish)
    return new_dish

# Ендпоінт для отримання всього меню конкретного закладу за його ID
@router.get("/{establishment_id}", response_model=list[MenuItemResponse])
def get_menu_by_establishment(establishment_id: int, db: Session = Depends(get_db)):
    return db.query(MenuItem).filter(MenuItem.establishment_id == establishment_id).all()

# 🌟 3. НОВИЙ ЕНДПОЇНТ ДЛЯ РЕДАГУВАННЯ СТРАВИ (PUT): дозволяє змінювати ціни, описи та категорії
@router.put("/{menu_item_id}", response_model=MenuItemResponse)
def update_menu_item(menu_item_id: int, item: MenuItemCreate, db: Session = Depends(get_db)):
    db_dish = db.query(MenuItem).filter(MenuItem.id == menu_item_id).first()
    
    if not db_dish:
        raise HTTPException(status_code=404, detail="Страву не знайдено в базі даних")
    
    # Оновлюємо кожне поле новими даними
    db_dish.name = item.name
    db_dish.description = item.description
    db_dish.price = item.price
    db_dish.image_url = item.image_url
    db_dish.category = item.category  # Дозволяє миттєво перекинути страву в іншу категорію
    
    db.commit()
    db.refresh(db_dish)
    return db_dish

# Ендпоінт для видалення страви з меню за її ID
@router.delete("/{menu_item_id}")
def delete_menu_item(menu_item_id: int, db: Session = Depends(get_db)):
    db_dish = db.query(MenuItem).filter(MenuItem.id == menu_item_id).first()
    
    if not db_dish:
        raise HTTPException(status_code=404, detail="Страву не знайдено")
    
    db.delete(db_dish)
    db.commit()
    return {"status": "success", "message": f"Страва #{menu_item_id} успішно видалена з меню"}
