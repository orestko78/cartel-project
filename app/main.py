from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  
from fastapi.responses import FileResponse
import os

# Імпорти моделей та роутерів з папки app
from app.models.booking import Booking
from app.routes.booking import router as booking_router
from app.models.menu import MenuItem
from app.routes.menu import router as menu_router
from app.models.establishment import Establishment
from app.routes.establishment import router as establishment_router

# Імпорти бази даних та сідера
from app.database import engine, Base, SessionLocal
from app.seed import seed_data

# Автоматично створюємо таблиці в базі даних при старті
Base.metadata.create_all(bind=engine)

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

# Підключаємо роутери для API
app.include_router(establishment_router)
app.include_router(booking_router)
app.include_router(menu_router)

# Визначаємо точний шлях до папки static (працює і для Render, і локально)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Якщо main.py лежить у корені поруч з app, коригуємо шлях до app/static
if not os.path.exists(STATIC_DIR) and os.path.exists(os.path.join(BASE_DIR, "app", "static")):
    STATIC_DIR = os.path.join(BASE_DIR, "app", "static")

# Монтуємо статику
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Автонаповнення бази даних перенесено сюди — воно спрацює строго в момент запуску сервера
@app.on_event("startup")
def startup_populate_db():
    db = SessionLocal()
    try:
        seed_data(db)
    except Exception as e:
        print(f"❌ Помилка під час автонаповнення бази: {e}")
    finally:
        db.close()

# Прямі маршрути для HTML-сторінок
@app.get("/")
@app.get("/index.html")
def read_index():
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))

@app.get("/hotels.html")
def read_hotels():
    return FileResponse(os.path.join(STATIC_DIR, "hotels.html"))

@app.get("/restaurants.html")
def read_restaurants():
    return FileResponse(os.path.join(STATIC_DIR, "restaurants.html"))

# Підстраховка: якщо фронтенд просить картинку без /static, віддаємо її з правильної папки
@app.get("/images/{image_name}")
def get_image_fallback(image_name: str):
    # STATIC_DIR ми визначили вище у файлі main.py
    img_path = os.path.join(STATIC_DIR, "images", image_name)
    if os.path.exists(img_path):
        return FileResponse(img_path)
    return FileResponse(os.path.join(STATIC_DIR, "images", "rebra.jpg")) # дефолтна картинка, якщо файл не знайдено

@app.get("/admin.html")
def read_admin():
    return FileResponse(os.path.join(STATIC_DIR, "admin.html"))