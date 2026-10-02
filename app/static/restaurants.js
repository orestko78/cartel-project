let lastScrollTop = 0;

/* Розумне приховування та поява хедера при скролі */
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header') || document.getElementById('header-placeholder') || document.querySelector('header');
    if (!header) return; 

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 50) {
        header.classList.add('header-hidden');
    } else {
        header.classList.remove('header-hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

const translations = {
    uk: {
        nav_about: "Про нас", 
        nav_restaurants: "Ресторани", 
        nav_hotels: "Готелі", 
        nav_spa: "SPA", 
        nav_team: "Команда", 
        nav_jobs: "Вакансії", 
        nav_blog: "Блог", 
        nav_contact: "Контакти",
        
        hero_title: "Мережа ресторанів <span>CARTEL</span>", 
        hero_desc: "Вишукана гастрономія, авторські концепції від шеф-кухарів та незабутні смакові поєднання в самому серці Карпат.",
        restaurants_section_title: "Наші ресторани у <span>Буковелі</span>",
        restaurants_section_desc: "Авторська кухня, локальні смаки та особлива атмосфера для кожної нагоди.",
        
        card_restaurant: "🥩 Ресторан",
        btn_visit: "Зайти до закладу",

        // 🌟 ПЕРЕКЛАДИ ДЛЯ КУХОНЬ (UK)
        cuisine_asian: "Азійська кухня",
        cuisine_european_lounge: "Європейська / Lounge",
        cuisine_eastern: "Схiдна кухня",
        cuisine_fish_grill: "Рибний ресторан / Grill",
        cuisine_ukrainian: "Українська кухня",
        cuisine_european: "Європейська кухня",
        cuisine_meat: "М'ясний ресторан",
        cuisine_meat_grill: "Meat & Grill",
        cuisine_italian_wine: "Fine Italian & Wine",
        cuisine_ukrainian_trad: "Ukrainian Traditional",
        cuisine_fine_dining: "Fine Dining & Steaks",
        cuisine_european_seafood: "European & European Seafood",
        cuisine_craft_beer: "Craft Beer & Pub Food",
        cuisine_carpathian_ukrainian: "Carpathian & Ukrainian",

        // 🌟 ПЕРЕКЛАДИ ДЛЯ ЛОКАЦІЙ (UK)
        loc_vyshni: "📍 Буковель, ділянка Вишні",
        loc_polyanytsya: "📍 Буковель, Поляниця",
        loc_lift13: "📍 Буковель, Нижня станція витягу 13",
        loc_lake: "📍 Буковель, озеро Молодості",
        loc_bukovel_general: "📍 Буковель",
        loc_frankivsk: "📍 Івано-Франківськ, пл. Міцкевича, 4",
        loc_yaremche: "📍 Яремче, вул. І. Петраша, 62",
        loc_lift5: "📍 Буковель, біля нижньої станції витягу №5",
        loc_zone2: "📍 Буковель, житлова зона №2",
        loc_upper_lifts: "📍 Буковель, верхні станції витягів",
        loc_vip_residence: "📍 Буковель, центральна площа, готель VIP-резиденція",
        loc_vip_lake: "📍 Буковель, VIP-зона, біля озера Молодості",
        loc_lift2: "📍 Буковель, житловий масив, біля витягу №2",
        loc_ethno_lake: "📍 Буковель, етно-зона біля озера"
    },
    en: {
        nav_about: "About Us", 
        nav_restaurants: "Restaurants", 
        nav_hotels: "Hotels", 
        nav_spa: "SPA", 
        nav_team: "Team", 
        nav_jobs: "Careers", 
        nav_blog: "Blog", 
        nav_contact: "Contacts",
        
        hero_title: "Restaurants Network <span>CARTEL</span>", 
        hero_desc: "Exquisite gastronomy, author concepts from chefs, and unforgettable flavor combinations in the heart of the Carpathians.",
        restaurants_section_title: "Our restaurants in <span>Bukovel</span>",
        restaurants_section_desc: "Chef-led cuisine, local flavors, and distinctive settings for every occasion.",
        
        card_restaurant: "🥩 Restaurant",
        btn_visit: "Visit establishment",

        // 🌟 ПЕРЕКЛАДИ ДЛЯ КУХОНЬ (EN)
        cuisine_asian: "Asian Cuisine",
        cuisine_european_lounge: "European / Lounge",
        cuisine_eastern: "Eastern Cuisine",
        cuisine_fish_grill: "Fish Restaurant / Grill",
        cuisine_ukrainian: "Ukrainian Cuisine",
        cuisine_european: "European Cuisine",
        cuisine_meat: "Meat Restaurant",
        cuisine_meat_grill: "Meat & Grill",
        cuisine_italian_wine: "Fine Italian & Wine",
        cuisine_ukrainian_trad: "Ukrainian Traditional",
        cuisine_fine_dining: "Fine Dining & Steaks",
        cuisine_european_seafood: "European & European Seafood",
        cuisine_craft_beer: "Craft Beer & Pub Food",
        cuisine_carpathian_ukrainian: "Carpathian & Ukrainian",

        // 🌟 ПЕРЕКЛАДИ ДЛЯ ЛОКАЦІЙ (EN)
        loc_vyshni: "📍 Bukovel, Vyshni Area",
        loc_polyanytsya: "📍 Bukovel, Polyanytsya",
        loc_lift13: "📍 Bukovel, Near Lower Station of Ski Lift No. 13",
        loc_lake: "📍 Bukovel, Lake of Youth",
        loc_bukovel_general: "📍 Bukovel",
        loc_frankivsk: "📍 Ivano-Frankivsk, 4 Mickiewicza Sq.",
        loc_yaremche: "📍 Yaremche, 62 I. Petrasha St.",
        loc_lift5: "📍 Bukovel, Near Lower Station of Ski Lift No. 5",
        loc_zone2: "📍 Bukovel, Residential Zone No. 2",
        loc_upper_lifts: "📍 Bukovel, Upper Stations of Ski Lifts",
        loc_vip_residence: "📍 Bukovel, Central Square, VIP Residence Hotel",
        loc_vip_lake: "📍 Bukovel, VIP Zone, Near Lake of Youth",
        loc_lift2: "📍 Bukovel, Residential Area, Near Ski Lift No. 2",
        loc_ethno_lake: "📍 Bukovel, Ethno Zone Near the Lake"
    }
};


function setLanguage(lang) {
    localStorage.setItem('cartel_lang', lang);
    
    // Оновлюємо всі елементи з data-i18n (включно з картками)
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    const langUk = document.getElementById('lang-uk');
    const langEn = document.getElementById('lang-en');
    if (langUk && langEn) {
        langUk.classList.remove('active-lang'); 
        langEn.classList.remove('active-lang');
        const activeLangBtn = document.getElementById('lang-' + lang);
        if (activeLangBtn) activeLangBtn.classList.add('active-lang');
    }
}

async function loadHeader() {
    try {
        const response = await fetch('/static/header.html');
        if (response.ok) {
            const html = await response.text();
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;
                
                const btnUk = document.getElementById('lang-uk');
                const btnEn = document.getElementById('lang-en');
                
                if (btnUk) btnUk.onclick = () => setLanguage('uk');
                if (btnEn) btnEn.onclick = () => setLanguage('en');
                
                const currentLang = localStorage.getItem('cartel_lang') || 'uk';
                setLanguage(currentLang);
            }
        }
    } catch (error) { 
        console.error("Помилка завантаження шапки:", error); 
    }
}

async function loadFooter() {
    try {
        const response = await fetch('/static/footer.html');
        if (response.ok) {
            const html = await response.text();
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) placeholder.outerHTML = html;
        } else {
            console.error("Не вдалося завантажити footer.html: статус", response.status);
        }
    } catch (error) {
        console.error("Помилка завантаження підвалу:", error);
    }
}

// Зберігаємо поточний індекс слайда для кожного слайдера окремо
const sliderIndexes = {};

function moveSlide(sliderId, direction, event) {
    if (event) event.stopPropagation(); // Зупиняємо клік, щоб не відкривати сторінку закладу
    
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    const track = slider.querySelector('.slider-track');
    if (!track) return;
    
    const slides = track.querySelectorAll('.slide');
    
    if (!sliderIndexes[sliderId]) {
        sliderIndexes[sliderId] = 0;
    }
    
    sliderIndexes[sliderId] += direction;
    
    // Зациклювання слайдера
    if (sliderIndexes[sliderId] >= slides.length) {
        sliderIndexes[sliderId] = 0;
    } else if (sliderIndexes[sliderId] < 0) {
        sliderIndexes[sliderId] = slides.length - 1;
    }
    
    const offset = -sliderIndexes[sliderId] * 100;
    track.style.transform = `translateX(${offset}%)`;
}

async function loadEstablishments() {
    try {
        const response = await fetch('/api/establishments/');
        const data = await response.json();
        const grid = document.getElementById('establishments-grid');
        if (!grid) return;
        grid.innerHTML = '';
        
        if (data.length === 0) {
            grid.innerHTML = '<p class="empty-state">Наразі немає доданих закладів.</p>';
            return;
        }

        const restaurants = data.filter(item => {
            if (!item.type) return false;
            const t = item.type.toLowerCase();
            return t === 'restaurant' || t === 'ресторан';
        });

        if (restaurants.length === 0) {
            grid.innerHTML = '<p class="empty-state">Наразі немає доданих ресторанів.</p>';
            return;
        }

        const currentLang = localStorage.getItem('cartel_lang') || 'uk';
        const t = translations[currentLang] || translations['uk'];

        restaurants.forEach((item, index) => {
            const card = document.createElement('div'); 
            card.className = 'card';
            card.onclick = () => { window.location.href = `/static/establishment_detail.html?id=${item.id}`; };
            
            // 🌍 ІНТЕЛЕКТУАЛЬНИЙ АВТО-ПЕРЕКЛАД КУХНІ НА ЛЬОТУ ПРИ РЕНДЕРИНГУ
            let cuisineKey = 'cuisine_european';
            const c = (item.cuisine || '').toLowerCase();
            if (c.includes('азійськ') || c.includes('asian')) cuisineKey = 'cuisine_asian';
            else if (c.includes('lounge') || c.includes('лаунж')) cuisineKey = 'cuisine_european_lounge';
            else if (c.includes('схiдн') || c.includes('eastern')) cuisineKey = 'cuisine_eastern';
            else if (c.includes('рибн') || c.includes('fish')) cuisineKey = 'cuisine_fish_grill';
            else if (c.includes('традиц') || c.includes('traditional')) cuisineKey = 'cuisine_ukrainian_trad';
            else if (c.includes('українськ') || c.includes('ukrainian')) cuisineKey = 'cuisine_ukrainian';
            else if (c.includes('м\'ясн') || c.includes('meat')) cuisineKey = 'cuisine_meat_grill';
            else if (c.includes('italian') || c.includes('італійськ')) cuisineKey = 'cuisine_italian_wine';
            else if (c.includes('dining') || c.includes('стейк')) cuisineKey = 'cuisine_fine_dining';
            else if (c.includes('seafood') || c.includes('морепрод')) cuisineKey = 'cuisine_european_seafood';
            else if (c.includes('pub') || c.includes('пиво') || c.includes('craft')) cuisineKey = 'cuisine_craft_beer';
            else if (c.includes('карпатськ') || c.includes('carpathian')) cuisineKey = 'cuisine_carpathian_ukrainian';
            else if (c.includes('mangalica') || c.includes('м’ясний')) cuisineKey = 'cuisine_meat';

            // 🌍 ІНТЕЛЕКТУАЛЬНИЙ АВТО-ПЕРЕКЛАД АДРЕСИ НА ЛЬОТУ ПРИ РЕНДЕРИНГУ
            let locationKey = 'loc_bukovel_general';
            const l = (item.location || '').toLowerCase();
            if (l.includes('вишні')) locationKey = 'loc_vyshni';
            else if (l.includes('поляниця')) locationKey = 'loc_polyanytsya';
            else if (l.includes('13')) locationKey = 'loc_lift13';
            else if (l.includes('молодості') && l.includes('vip')) locationKey = 'loc_vip_lake';
            else if (l.includes('молодості')) locationKey = 'loc_lake';
            else if (l.includes('міцкевича') || l.includes('франківськ')) locationKey = 'loc_frankivsk';
            else if (l.includes('петраша') || l.includes('яремче')) locationKey = 'loc_yaremche';
            else if (l.includes('5')) locationKey = 'loc_lift5';
            else if (l.includes('зона №2')) locationKey = 'loc_zone2';
            else if (l.includes('верхні')) locationKey = 'loc_upper_lifts';
            else if (l.includes('резиденція') || l.includes('центральна')) locationKey = 'loc_vip_residence';
            else if (l.includes('витягу №2')) locationKey = 'loc_lift2';
            else if (l.includes('етно-зона') || l.includes('етно')) locationKey = 'loc_ethno_lake';

            // Витягуємо фінальний текст під вибрану мову з об'єкта перекладів
            const cuisineText = t[cuisineKey] || (item.cuisine ? item.cuisine : 'Преміум сервіс');
            const locationText = t[locationKey] || item.location;

            // Перевіряємо, чи є масив зображень (item.images)
            let images = [];
            if (item.images && Array.isArray(item.images) && item.images.length > 0) {
                images = item.images;
            } else if (item.image_url) {
                images = [item.image_url];
            } else {
                images = ['/static/images/rebra.jpg'];
            }

            let imageSectionHtml = '';
            let sliderControlsHtml = '';
            const sliderId = `slider-${index}`;

            if (images.length > 1) {
                let slidesHtml = images.map(imgUrl => `
                    <div class="slide"><img src="${imgUrl}" alt="${item.name}"></div>
                `).join('');

                imageSectionHtml = `
                    <div class="image-slider" id="${sliderId}">
                        <div class="slider-track">
                            ${slidesHtml}
                        </div>
                    </div>
                `;

                sliderControlsHtml = `
                    <div class="slider-controls">
                        <button class="slider-btn prev-btn" onclick="moveSlide('${sliderId}', -1, event)" title="Попереднє фото"><span></span></button>
                        <button class="slider-btn next-btn" onclick="moveSlide('${sliderId}', 1, event)" title="Наступне фото"><span></span></button>
                    </div>
                `;
            } else {
                imageSectionHtml = `<div class="card-image" style="background-image: url('${images[0]}');"></div>`;
                sliderControlsHtml = '';
            }
            
            // Заповнюємо внутрішній шаблон збалансованими мультимовними змінними
            card.innerHTML = `
                ${imageSectionHtml}
                <div class="card-content">
                    <div class="card-header-row">
                        <div class="card-type" data-i18n="card_restaurant">${t.card_restaurant}</div>
                        ${sliderControlsHtml}
                    </div>
                    <div class="card-title">${item.name}</div>
                    <div class="card-cuisine">${cuisineText}</div>
                    <button class="btn-visit" data-i18n="btn_visit">${t.btn_visit}</button>
                    <div class="card-footer">
                        <span>${locationText}</span>
                        <span class="rating">★ ${item.rating.toFixed(1)}</span>
                    </div>
                </div>`;

            const visitBtn = card.querySelector('.btn-visit');
            visitBtn.onclick = (event) => {
                event.stopPropagation(); 
                window.location.href = `/static/establishment_detail.html?id=${item.id}`;
            };

            grid.appendChild(card);
        });

        // Запускаємо переклад загальних статичних елементів на сторінці
        setLanguage(currentLang);

    } catch (error) { 
        console.error("Помилка завантаження даних:", error); 
    }
}

function closeModal() { 
    document.getElementById('booking-modal-overlay').classList.remove('active'); 
    document.getElementById('booking-form').reset(); 
}

async function submitBooking(event) {
    event.preventDefault();
    const bookingData = { 
        establishment_name: document.getElementById('form-establishment-name').value, 
        guest_name: document.getElementById('guest-name').value, 
        guest_phone: document.getElementById('guest-phone').value, 
        booking_date: document.getElementById('booking-date').value 
    };
    try {
        const response = await fetch('/api/bookings/', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(bookingData) 
        });
        if (response.ok) { 
            alert('Бронювання успішно створено!'); 
            closeModal(); 
        } else { 
            const errorData = await response.json(); 
            alert('Помилка при створенні бронювання: ' + (errorData.detail || 'Невідома помилка')); 
        }
    } catch (error) { 
        console.error("Помилка при відправці даних:", error); 
        alert('Помилка при створенні бронювання. Спробуйте ще раз.'); 
    }
}

function toggleMenu() { 
    const links = document.getElementById('navbar-links');
    const hamburger = document.getElementById('hamburger-btn');
    if (links) links.classList.toggle('mobile-active'); 
    if (hamburger) hamburger.classList.toggle('open'); 
}

window.addEventListener('DOMContentLoaded', async () => { 
    await loadHeader();
    if (typeof loadHero === 'function') {
        await loadHero('/static/images/restaurants.jpg');
    }
    await loadFooter(); 
    loadEstablishments(); 
    
    const currentLang = localStorage.getItem('cartel_lang') || 'uk';

    setLanguage(currentLang); 
});
