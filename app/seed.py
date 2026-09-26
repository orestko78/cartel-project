from sqlalchemy.orm import Session
from .models.establishment import Establishment
from .models.menu import MenuItem

def seed_data(db: Session):
    # if db.query(Establishment).first() is not None:
    #     print("ℹ️ База даних уже має заклади. Пропускаємо автонаповнення.")
    #     return

    print("🚀 Починаємо автоматичне наповнення бази даних Cartel...")

    # 🥩 1. Створюємо ресторан REBRA BBQ з повним преміум-описом, контентом та картою
    rebra_bbq = Establishment(
        name="REBRA BBQ beer`n`grill",
        type="Restaurant",
        cuisine="Meat & Grill",
        location="Буковель, біля нижньої станції витягу №5",
        rating=4.9,
        image_url="/static/images/rebra/rebra14.jpg",
        description="""
        <p class="desc-slogan" style="font-size: 18px; font-weight: bold; color: #fff; margin-bottom: 10px;">
            Демократичний м’ясний BBQ ресторан у форматі casual food.
        </p>
        <p class="desc-sub-slogan" style="font-size: 16px; color: #ccc; margin-bottom: 25px;">
            Свинячі ребра бейбі бек рібс, філе індички, курячі крильця.
        </p>
        
        <div class="desc-quick-nav" style="margin: 25px 0; display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="#menu" style="border: 1px solid #d4af37; color: #d4af37; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 13px; text-transform: uppercase;">ПЕРЕГЛЯНУТИ МЕНЮ</a>
            <a href="#hours" style="border: 1px solid #d4af37; color: #d4af37; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 13px; text-transform: uppercase;">КОНТАКТИ ТА ГОДИНИ РОБОТИ</a>
            <a href="#map" style="border: 1px solid #d4af37; color: #d4af37; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 13px; text-transform: uppercase;">РОЗТАШУВАННЯ НА МАПІ</a>
        </div>

        <p style="margin-bottom: 20px; line-height: 1.7;">
            Ресторан Rebra BBQ beer`n`grill розташований біля нижньої станції витягу №5. Наші кухарі навчилися коптити м'ясо на кухні ресторану Southside Market у столиці техаської барбекю-культури — місті Елджін Таун і презентують смачну новинку гостям Буковелю.
        </p>
        
        <h3 style="color: #d4af37; margin-top: 30px; margin-bottom: 15px; font-size: 22px; font-family: 'Cormorant Garamond', serif;">Легендарні хіти техаського барбекю</h3>
        <p style="margin-bottom: 20px; line-height: 1.7;">
            Завдяки технології приготування Low & Slow яловича грудинка набуває неймовірного смаку. Її повільно коптять протягом 18 годин при температурі 100 градусів у власній техаській коптильні. До м'яса додаємо лише 3 спеції — чорний перець, сіль та трохи кайєнського перцю. Хліб та булочки для бургерів випікаємо власноруч, за прикладом якості американської мережі ресторанів Shake & Shack. Ми були першими, хто привіз в Україну унікальну коптильню на дровах J&R. Завдяки передовим технологіям ми можемо щоранку отримувати свіже копчене м'ясо та підтримувати постійну температуру продукту.
        </p>
        
        <p style="margin-top: 25px; color: #aaa;">За всіма новинами слідкуйте на наших сторінках у <strong>Facebook</strong> та <strong>Instagram</strong></p>
        <p style="font-size: 20px; color: #fff; margin: 15px 0; font-weight: bold;">📞 +38 (067) 350 6611</p>
        <p style="color: #ff4d4d; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px;">🔴 тимчасово зачинено</p>
        """,
        
        map_iframe='''<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1811.2123686146876!2d24.403288511212853!3d48.35677467138025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4737186fd34d7e05%3A0xf74df878633987fc!2sRebra%20BBQ%20beer%60n%60grill!5e1!3m2!1suk!2sua!4v1790443475450!5m2!1suk!2sua" width="100%" height="450" style="border:0; border-radius: 12px;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>''',
        
        images=[
            "/static/images/rebra/rebra1.jpg", "/static/images/rebra/rebra2.jpg", "/static/images/rebra/rebra3.jpg",
            "/static/images/rebra/rebra4.jpg", "/static/images/rebra/rebra5.jpg", "/static/images/rebra/rebra6.jpg",
            "/static/images/rebra/rebra7.jpg", "/static/images/rebra/rebra8.jpg", "/static/images/rebra/rebra9.jpg",
            "/static/images/rebra/rebra10.jpg", "/static/images/rebra/rebra11.jpg", "/static/images/rebra/rebra12.jpg",
            "/static/images/rebra/rebra13.jpg", "/static/images/rebra/rebra14.jpg"
        ]
    )

    # 🍕 2. Створюємо ресторан Osteria Italiana з повним преміум-описом, контентом та картою
    osteria_italiana = Establishment(
        name="Osteria Italiana",
        type="Restaurant",
        cuisine="Fine Italian & Wine",
        location="Буковель, житлова зона №2",
        rating=4.8,
        image_url="/static/images/osteria.jpg",
        description="""
        <p class="desc-slogan" style="font-size: 18px; font-weight: bold; color: #fff; margin-bottom: 10px;">
            Вишуканий ресторан класичної італійської кухні в серці Карпат.
        </p>
        <p class="desc-sub-slogan" style="font-size: 16px; color: #ccc; margin-bottom: 25px;">
            Свіжа паста власного виробництва, традиційна піца з дров'яної печі та винна карта.
        </p>
        
        <div class="desc-quick-nav" style="margin: 25px 0; display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="#menu" style="border: 1px solid #d4af37; color: #d4af37; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 13px; text-transform: uppercase;">ПЕРЕГЛЯНУТИ МЕНЮ</a>
            <a href="#hours" style="border: 1px solid #d4af37; color: #d4af37; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 13px; text-transform: uppercase;">КОНТАКТИ ТА ГОДИНИ РОБОТИ</a>
            <a href="#map" style="border: 1px solid #d4af37; color: #d4af37; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 13px; text-transform: uppercase;">РОЗТАШУВАННЯ НА МАПІ</a>
        </div>

        <p style="margin-bottom: 20px; line-height: 1.7;">
            Osteria Italiana запрошує гостей зануритися в атмосферу сонячної Італії серед засніжених українських гір. Наша концепція базується на використанні автентичних італійських продуктів преміум-якості та збереженні класичних середземноморських кулінарних традицій.
        </p>
        <h2 style="font-size: 24px; color: #d4af37; margin-top: 30px; margin-bottom: 15px; font-family: 'Cormorant Garamond', serif;">Традиції класичної італійської вечері</h2>
        <p style="margin-bottom: 20px; line-height: 1.7;">
            Кожна страва у нашому меню — це маленька подорож. Наші шеф-кухарі щоранку вручну готують свіжу пасту та равіолі. Тонка піца випікається на живому вогні у класичній купольній печі за температури 450 градусів. Професійний сомельє завжди допоможе підібрати ідеальну пару до вашої вечері з нашої великої колекції тосканських та сицилійських вин.
        </p>
        
        <p style="margin-top: 25px; color: #aaa;">Резерв столів та актуальні новини у нашому <strong>Instagram</strong></p>
        <p style="font-size: 20px; color: #fff; margin: 15px 0; font-weight: bold;">📞 +38 (067) 111 2233</p>
        <p style="color: #2ecc71; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px;">🟢 Відчинено • Чекаємо на вас</p>
        """,
        map_iframe='<iframe src="https://google.com" width="100%" height="450" style="border:0; border-radius: 12px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    )

    # 🥟 3. Ресторан Filvarok з картою
    filvarok = Establishment(
        name="Filvarok",
        type="Restaurant",
        cuisine="Ukrainian Traditional",
        location="Буковель, верхні станції витягів",
        rating=4.7,
        image_url="/static/images/filvarok.jpg",
        description="Легендарна українська гостинність, карпатські традиційні страви, банош на кострі, гарячий глінтвейн та унікальна автентична атмосфера куреня.",
        map_iframe='<iframe src="https://google.com" width="100%" height="450" style="border:0; border-radius: 12px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    )

    # 🛏️ 4. Апартготель BUKA з картою
    buka_hotel = Establishment(
        name="BUKA Apart-Hotel",
        type="Hotel",
        cuisine="Апартготель у центральній локації",
        location="Буковель, центр",
        rating=5.0,
        image_url="/static/images/buka.jpg",
        description="Преміальні апартаменти в самому епіцентрі курорту Буковель. Сучасний дизайн, власна спа-зона та безпосередній вихід до найкращих трас.",
        map_iframe='<iframe src="https://google.com" width="100%" height="450" style="border:0; border-radius: 12px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    )

    # 🏔️ 5. Апартаменти Mountain Residence з картою
    mountain_residence = Establishment(
        name="Mountain Residence Apartments",
        type="Hotel",
        cuisine="Готель на трасі 2C",
        location="Буковель, VIP-зона біля траси 2C",
        rating=5.0,
        image_url="/static/images/ribeye_dish.jpg",
        description="Ексклюзивний формат відпочинку ski-in/ski-out. Панорамні вікна з видом на гори, розкішний сервіс та максимальний затишок преміум-класу.",
        map_iframe='',
        images=[
            "/static/images/mountain_residence/Mountain1.jpg",
            "/static/images/mountain_residence/Mountain2.jpg",
            "/static/images/mountain_residence/Mountain3.jpg"
        ]
    )

    # Зберігаємо заклади в базу даних
    db.add_all([rebra_bbq, osteria_italiana, filvarok, buka_hotel, mountain_residence])
    db.commit()
    db.refresh(rebra_bbq)
    db.refresh(osteria_italiana)

    # 🥩 Наповнюємо меню для REBRA BBQ
    dish1 = MenuItem(
        establishment_id=rebra_bbq.id,
        name="Фірмові свинячі ребра BBQ",
        description="М'ясисті фермерські свинячі ребра, глазуровані в авторському соусі на основі закарпатського меду та віскі. Подаються з маринованою цибулею",
        price=380.0,
        image_url="/static/images/ribs_dish.jpg"
    )
    dish2 = MenuItem(
        establishment_id=rebra_bbq.id,
        name="Картопля на грилі з салом",
        description="Молода карпатська картопля, запечена на вогні з ароматним підчеревком та свіжим кропом",
        price=120.0,
        image_url="/static/images/potato_dish.jpg"
    )
    dish3 = MenuItem(
        establishment_id=rebra_bbq.id,
        name="Стейк Рібай (Premium зрілість)",
        description="Соковитий шматок мармурової яловичини, обсмажений на відкритому вогні з додаванням чебрецю, розмарину та вершкового масла",
        price=620.0,
        image_url="/static/images/ribeye_dish.jpg"
    )

    # 🍕 Наповнюємо меню для Osteria Italiana
    dish4 = MenuItem(
        establishment_id=osteria_italiana.id,
        name="Паста Карбонара",
        description="Справжня римська паста з в'яленою свинячою щокою гуанчіале, жовтками та витриманим сиром Пекоріно Романо",
        price=290.0,
        image_url="/static/images/carbonara.jpg"
    )

    db.add_all([dish1, dish2, dish3, dish4])
    db.commit()
    print("✨ Автонаповнення бази успішно завершено! Всі нові описи, заклади, карти та страви збережено.")