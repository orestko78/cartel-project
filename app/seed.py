import os
import json
from sqlalchemy.orm import Session
from .models.establishment import Establishment
from .models.menu import MenuItem

def seed_data(db: Session):
    # Визначаємо шляхи до папок з контентом JSON
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    EST_DIR = os.path.join(BASE_DIR, "data", "establishments")
    MENU_DIR = os.path.join(BASE_DIR, "data", "menu")

    # Перевіряємо, чи існують папки
    if not os.path.exists(EST_DIR):
        print(f"⚠️ Папку з даними не знайдено за шляхом: {EST_DIR}. Пропускаємо сідерер.")
        return

    print("🚀 Починаємо АВТОМАТИЧНЕ зчитування контенту з файлів JSON...")

    # 1. СКАНИРУЄМО ТА ЗАВАНТАЖУЄМО ЗАКЛАДИ
    for filename in sorted(os.listdir(EST_DIR)):
        if filename.endswith(".json"):
            file_path = os.path.join(EST_DIR, filename)
            
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                
                # Перевіряємо, чи немає вже такого закладу в базі
                existing = db.query(Establishment).filter(Establishment.name == data["name"]).first()
                if not existing:
                    
                    # 🌟 ГОЛОВНИЙ ІНЖЕНЕРНИЙ ФІКС ДЛЯ МУЛЬТИМОВНОСТІ БАЗИ ДАНИХ
                    # Окремо витягуємо українську та англійську версії з JSON-масивів
                    raw_desc_uk = data.get("description_uk")
                    raw_desc_en = data.get("description_en")

                    # Склеюємо рядки через перенос, щоб зберегти красиву структуру в VS Code
                    if isinstance(raw_desc_uk, list):
                        final_description_uk = "\n".join(raw_desc_uk)
                    else:
                        final_description_uk = raw_desc_uk

                    if isinstance(raw_desc_en, list):
                        final_description_en = "\n".join(raw_desc_en)
                    else:
                        final_description_en = raw_desc_en

                    new_est = Establishment(
                        name=data["name"],
                        type=data["type"],
                        cuisine=data.get("cuisine"),
                        location_uk=data.get("location_uk", "Буковель"),
                        location_en=data.get("location_en", "Bukovel"),
                        rating=data.get("rating", 5.0),
                        image_url=data.get("image_url"),
                        images=data.get("images"),
                        description_uk=final_description_uk, # 🌟 Записуємо чистий український текст у БД
                        description_en=final_description_en, # 🌟 Записуємо чистий англійський текст у БД
                        map_iframe=data.get("map_iframe")
                    )
                    db.add(new_est)
                    db.commit()
                    db.refresh(new_est)
                    print(f"   ➕ Заклад успішно імпортовано з файлу: {filename}")

                    # 2. ОДРАЗУ ОНОВЛЮЄМО МЕНЮ ДЛЯ ЦЬОГО ЗАКЛАДУ (якщо є файл меню)
                    menu_filename = filename.replace(".json", "_menu.json")
                    menu_file_path = os.path.join(MENU_DIR, menu_filename)
                    
                    if os.path.exists(menu_file_path):
                        with open(menu_file_path, "r", encoding="utf-8") as mf:
                            dishes = json.load(mf)
                            
                            for dish in dishes:
                                new_dish = MenuItem(
                                    establishment_id=new_est.id,
                                    name=dish["name"],
                                    description=dish.get("description"),
                                    price=dish["price"],
                                    image_url=dish.get("image_url"),
                                    # Автоматично зчитуємо категорію страви з JSON файлу
                                    category=dish.get("category", "Основні страви")
                                )
                                db.add(new_dish)
                            db.commit()
                            print(f"      🧮 Додано {len(dishes)} страв меню для: {new_est.name}")

    print("✨ Архітектурне автонаповнення бази завершено! Усі JSON файли успішно імпортовано.")
