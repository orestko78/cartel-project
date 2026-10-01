import os
import json
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Надійно визначаємо шлях до бази даних
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'cartel.db')}"

# Створюємо двигун бази даних (engine)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Створюємо фабрику сесій
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base-клас для моделей
Base = declarative_base()

# Функція для отримання доступу до БД в ендпоінтах
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🌟 УНІВЕРСАЛЬНА ФУНКЦІЯ ОБРОБКИ JSON ОПИСУ СТРАВ ТА ЗАКЛАДІВ
def prepare_description(description_data) -> str:
    """
    Автоматично перевіряє формат опису з JSON:
    якщо це масив рядків — склеює їх через новий рядок,
    якщо звичайний рядок — залишає його без змін.
    """
    if not description_data:
        return ""
    if isinstance(description_data, list):
        return "\n".join(description_data)
    return str(description_data)


# 🚀 Приклад використання при завантаженні JSON (якщо сидер вмонтований сюди):
def seed_establishments_example(db: Session, json_file_path: str, establishment_model):
    if not os.path.exists(json_file_path):
        return
        
    with open(json_file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    # Склеюємо масив рядків опису перед записом у базу SQLite
    description_text = prepare_description(data.get("description"))
    
    # Створення об'єкта для бази даних
    # new_est = establishment_model(
    #     name=data.get("name"),
    #     description=description_text, # Записується красивий монолітний рядок
    #     ...
    # )
