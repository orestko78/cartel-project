from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # Імпортуємо модуль для роботи зі статикою
import os
from .models.booking import Booking
from .routes.booking import router as booking_router
from .models.menu import MenuItem
from .routes.menu import router as menu_router
from .database import engine, Base
from .models.establishment import Establishment
from .routes.establishment import router as establishment_router
from .seed import seed_data
from .database import SessionLocal

Base.metadata.create_all(bind=engine)

# Автонаповнення бази даних при запуску
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(
    title="Cartel Network API",
    description="Преміум API для мережі готелів та ресторанів Cartel",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Підключаємо роутер для API
app.include_router(establishment_router)
app.include_router(booking_router)
app.include_router(menu_router)

# Монтуємо папку static, щоб відображати наш шикарний дизайн на головній сторінці
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.mount("/", StaticFiles(directory=os.path.join(BASE_DIR, "static"), html=True), name="static")