from sqlalchemy.orm import Session
from .models.establishment import Establishment
from .models.menu import MenuItem

def seed_data(db: Session):
    if db.query(Establishment).first() is not None:
        print("ℹ️ База даних уже має заклади. Пропускаємо автонаповнення.")
        return

    print("🚀 Починаємо автоматичне наповнення бази даних Cartel...")

    # Створюємо преміум-заклади
    rebra_bbq = Establishment(
        name="REBRA BBQ",
        type="Restaurant",
        cuisine="Meat & Grill",
        location="Bukovel",
        rating=4.9,
        image_url="/images/rebra.jpg"
    )

    osteria_italiana = Establishment(
        name="Osteria Italiana",
        type="Restaurant",
        cuisine="Fine Italian & Wine",
        location="Bukovel",
        rating=4.8,
        image_url="/images/osteria.jpg"
    )

    filvarok = Establishment(
        name="Filvarok",
        type="Restaurant",
        cuisine="Ukrainian Traditional",
        location="Bukovel",
        rating=4.7,
        image_url="/images/filvarok.jpg"
    )

    db.add_all([rebra_bbq, osteria_italiana, filvarok])
    db.commit()
    db.refresh(rebra_bbq)
    db.refresh(osteria_italiana)

    # 🥩 Меню для REBRA BBQ
    dish1 = MenuItem(
        establishment_id=rebra_bbq.id,
        name="Фірмові свинячі ребра BBQ",
        description="М'ясисті фермерські свинячі ребра, глазуровані в авторському соусі на основі закарпатського меду та віскі. Подаються з маринованою цибулею",
        price=380.0,
        image_url="/images/ribs_dish.jpg"
    )

    dish2 = MenuItem(
        establishment_id=rebra_bbq.id,
        name="Картопля на грилі з салом",
        description="Молода карпатська картопля, запечена на вогні з ароматним підчеревком та свіжим кропом",
        price=120.0,
        image_url="/images/potato_dish.jpg"
    )

    dish3 = MenuItem(
        establishment_id=rebra_bbq.id,
        name="Стейк Рібай (Premium зрілість)",
        description="Соковитий шматок мармурової яловичини, обсмажений на відкритому вогні з додаванням чебрецю, розмарину та вершкового масла",
        price=620.0,
        image_url="/images/ribeye_dish.jpg"
    )

    # 🍕 Меню для Osteria Italiana
    dish4 = MenuItem(
        establishment_id=osteria_italiana.id,
        name="Паста Карбонара",
        description="Справжня римська паста з в'яленою свинячою щокою гуанчіале, жовтками та витриманим сиром Пекоріно Романо",
        price=290.0,
        image_url="/images/carbonara.jpg"
    )

    # 🔥 ТУТ МИ ТЕПЕР ЯВНО ЗБЕРІГАЄМО АБСОЛЮТНО ВСІ СТРАВИ, ВКЛЮЧАЮЧИ ДИШ3 (СТЕЙК)!
    db.add_all([dish1, db.refresh(rebra_bbq) or dish1, dish2, dish3, dish4])
    db.commit()
    print("✨ Автонаповнення бази успішно завершено! Всі три страви збережено.")

