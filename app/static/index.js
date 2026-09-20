let lastScrollTop = 0;

document.addEventListener("DOMContentLoaded", function() {
    const mapCenter = [48.3538, 24.4120];
    const map = L.map('real-map', { center: mapCenter, zoom: 16, scrollWheelZoom: false });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
    }).addTo(map);
    const locations = [
        { coords: [48.3555, 24.4130], name: "LE GRAND", link: "/restaurants/le-grand" },
        { coords: [48.3542, 24.4145], name: "VODA", link: "/clubs/voda" },
        { coords: [48.3535, 24.4120], name: "BUKA", link: "/hotels/buka" },
        { coords: [48.3528, 24.4150], name: "MOUNTAIN RESIDENCE", link: "/hotels/mountain-residence" },
        { coords: [48.3560, 24.4100], name: "GIRAFA", link: "/restaurants/girafa" },
        { coords: [48.3515, 24.4110], name: "BANYA", link: "/banya/banya" },
        { coords: [48.3525, 24.4135], name: "TEPPAN", link: "/restaurants/teppan" },
        { coords: [48.3530, 24.4160], name: "ASIA GARDEN", link: "/restaurants/asia-garden" }
    ];

    locations.forEach(loc => {
        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<a href="${loc.link}" class="custom-map-pin"><span class="pin-icon">📍</span><span class="pin-text">${loc.name}</span></a>`
        });
        L.marker(loc.coords, { icon: customIcon }).addTo(map);
    });
});

/* Скрол-функція: розумне приховування та поява хедера */
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (!header) return; // Захист від помилок, якщо хедер ще не підвантажився з сервера

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Якщо скролимо вниз і прокрутили більше ніж на 50px
    if (scrollTop > lastScrollTop && scrollTop > 50) {
        header.classList.add('header-hidden');
    } else {
        // Якщо скролимо вгору
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
        
        hero_title: "Мережа готелів та ресторанів <span>CARTEL</span>", 
        hero_desc: "Преміальні концепції відпочинку, вишукана гастрономія та легендарна атмосфера в самому серці Карпат.", 
        
        formats_main_title: "ОБЕРІТЬ СВІЙ ФОРМАТ", 
        formats_main_desc: "Ваша персональна історія відпочинку: від затишних апартаментів до гастрономічних відкриттів.",
        
        format_stay_title: "ЗУПИНИТИСЯ", 
        format_stay_desc: "Готелі та апартаменти", 
        
        format_taste_title: "СКУШТУВАТИ", 
        format_taste_desc: "Ресторани та гастрономія", 
        
        format_recover_title: "ВІДНОВИТИСЯ", 
        format_recover_desc: "SPA, VODA, баня", 
        
        format_relax_title: "ВІДПОЧИТИ", 
        format_relax_desc: "Розваги та активності",
        
        map_title: "CARTEL У КАРПАТАХ",
        map_desc: "Ми створюємо унікальні місця для вашого відпочинку в серці Українських Карпат."
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
        
        hero_title: "Hotels & Restaurants Network <span>CARTEL</span>", 
        hero_desc: "Premium leisure concepts, exquisite gastronomy, and a legendary atmosphere in the heart of the Carpathians.", 
        
        formats_main_title: "CHOOSE YOUR FORMAT", 
        formats_main_desc: "Your personal holiday story: from cozy apartments to gastronomic discoveries.",
        
        format_stay_title: "STAY", 
        format_stay_desc: "Hotels & Apartments", 
        
        format_taste_title: "TASTE", 
        format_taste_desc: "Restaurants & Gastronomy", 
        
        format_recover_title: "RECOVER", 
        format_recover_desc: "SPA, VODA, sauna", 
        
        format_relax_title: "RELAX", 
        format_relax_desc: "Entertainment & Activities",
        
        map_title: "CARTEL IN THE CARPATHIANS",
        map_desc: "We create unique places for your holiday in the heart of the Ukrainian Carpathians."
    }
};

function setLanguage(lang) {
    localStorage.setItem('cartel_lang', lang);
    
    // Перевіримо, які елементи знайшов скрипт на сторінці
    const elements = document.querySelectorAll('[data-i18n]');
    console.log("Знайдено елементів для перекладу:", elements.length);
    elements.forEach(el => console.log(el.getAttribute('data-i18n'), el));

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
                // Використовуємо innerHTML замість outerHTML, щоб сам блок-контейнер залишався на місці
                placeholder.innerHTML = html;
            }
        }
    } catch (error) { 
        console.error("Помилка завантаження шапки:", error); 
    }
}

window.addEventListener('DOMContentLoaded', async () => { 
    await loadHeader(); // Чекаємо, поки завантажиться шапка
    loadEstablishments(); 
    
    // Встановлюємо мову після того, як шапка успішно вставилась у DOM
    const currentLang = localStorage.getItem('cartel_lang') || 'uk';
    setLanguage(currentLang); 
});

async function loadEstablishments() {
    try {
        const response = await fetch('/api/establishments/');
        const data = await response.json();
        const grid = document.getElementById('establishments-grid');
        if (!grid) return;
        grid.innerHTML = '';
        if (data.length === 0) {
            grid.innerHTML = '<p class="empty-state">Наразі немає доданих закладів. Додайте їх через /docs</p>';
            return;
        }
        data.forEach(item => {
            const card = document.createElement('div'); card.className = 'card';
            card.onclick = () => { window.location.href = `/menu.html?id=${item.id}`; };
            const imageUrl = item.image_url ? item.image_url : 'https://unsplash.com';
            card.innerHTML = `<div class="card-image"></div><div class="card-content"><div class="card-type">${item.type === 'Restaurant' ? '🥩 Ресторан' : '🏨 Готель'}</div><div class="card-title">${item.name}</div><div class="card-cuisine">${item.cuisine ? item.cuisine : 'Преміум сервіс'}</div><div class="card-footer"><span>📍 ${item.location}</span><span class="rating">★ ${item.rating.toFixed(1)}</span></div></div>`;
            card.querySelector('.card-image').style.backgroundImage = `url('${imageUrl}')`;
            grid.appendChild(card);
        });
    } catch (error) { console.error("Помилка завантаження даних:", error); }
}

function openModal(name, type) {
    document.getElementById('modal-title').innerText = type === 'Restaurant' ? 'Бронювання столика' : 'Резерв номера';
    document.getElementById('modal-establishment-name').innerText = name;
    document.getElementById('form-establishment-name').value = name;
    document.getElementById('booking-modal-overlay').classList.add('active');
}
function closeModal() { document.getElementById('booking-modal-overlay').classList.remove('active'); document.getElementById('booking-form').reset(); }
async function submitBooking(event) {
    event.preventDefault();
    const bookingData = { establishment_name: document.getElementById('form-establishment-name').value, guest_name: document.getElementById('guest-name').value, guest_phone: document.getElementById('guest-phone').value, booking_date: document.getElementById('booking-date').value };
    try {
        const response = await fetch('/api/bookings/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookingData) });
        if (response.ok) { alert('Бронювання успішно створено!'); closeModal(); }
        else { const errorData = await response.json(); alert('Помилка при створенні бронювання: ' + (errorData.detail || 'Невідома помилка')); }
    } catch (error) { console.error("Помилка при відправці даних:", error); alert('Помилка при створенні бронювання. Спробуйте ще раз.'); }
}
function toggleMenu() { document.getElementById('navbar-links')?.classList.toggle('mobile-active'); document.getElementById('hamburger-btn')?.classList.toggle('open'); }

window.addEventListener('DOMContentLoaded', async () => { 
    await loadHeader(); // Чекаємо, поки завантажиться шапка
    loadEstablishments(); 
    
    // Встановлюємо мову ТІЛЬКИ після того, як шапка вже з'явилася на сторінці
    const currentLang = localStorage.getItem('cartel_lang') || 'uk';
    setLanguage(currentLang); 
});

let inactivityTimeout;
function showUI() {
    const hero = document.getElementById('hero-content');
    if (hero) hero.classList.remove('hidden-ui'); // Вертаємо видимість тексту
    
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        const links = document.getElementById('navbar-links');
        // Якщо мобільне меню не відкрите — ховаємо ТІЛЬКИ текст hero
        if (!(links && links.classList.contains('mobile-active'))) { 
            if (hero) hero.classList.add('hidden-ui'); 
        }
    }, 3500);
}

// Пов'язуємо таймер з рухами користувача
window.addEventListener('scroll', showUI);
document.addEventListener('mousemove', showUI);