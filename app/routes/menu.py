from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.menu import MenuItem
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/menu",
    tags=["Menu (Меню ресторанів)"]
)

class MenuItemCreate(BaseModel):
    establishment_id: int
    name: str
    description: str | None = None
    price: float
    image_url: str | None = None

@router.post("/")
def add_menu_item(item: MenuItemCreate, db: Session = Depends(get_db)):
    """Додає нову страву до конкретного ресторану"""
    new_item = MenuItem(
        establishment_id=item.establishment_id,
        name=item.name,
        description=item.description,
        price=item.price,
        image_url=item.image_url
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/{establishment_id}")
def get_restaurant_menu(establishment_id: int, db: Session = Depends(get_db)):
    """Повертає меню конкретного закладу за його ID"""
    return db.query(MenuItem).filter(MenuItem.establishment_id == establishment_id).all()