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
        
        card_restaurant: "🥩 Ресторан",
        btn_book: "Забронювати столик"
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
        
        card_restaurant: "🥩 Restaurant",
        btn_book: "Book a table"
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

        restaurants.forEach(item => {
            const card = document.createElement('div'); 
            card.className = 'card';
            card.onclick = () => { window.location.href = `/static/menu.html?id=${item.id}`; };
            
            const imageUrl = item.image_url ? item.image_url : '/static/images/rebra.jpg';
            
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${imageUrl}');"></div>
                <div class="card-content">
                    <div class="card-type" data-i18n="card_restaurant">${t.card_restaurant}</div>
                    <div class="card-title">${item.name}</div>
                    <div class="card-cuisine">${item.cuisine ? item.cuisine : 'Преміум сервіс'}</div>
                    <button class="btn-book-now" data-i18n="btn_book">${t.btn_book}</button>
                    <div class="card-footer">
                        <span>📍 ${item.location}</span>
                        <span class="rating">★ ${item.rating.toFixed(1)}</span>
                    </div>
                </div>`;
            
            const bookBtn = card.querySelector('.btn-book-now');
            bookBtn.onclick = (event) => {
                event.stopPropagation(); 
                openModal(item.name, 'Restaurant');
            };

            grid.appendChild(card);
        });

        setLanguage(currentLang);

    } catch (error) { 
        console.error("Помилка завантаження даних:", error); 
    }
}

function openModal(name, type) {
    document.getElementById('modal-title').innerText = 'Бронювання столика';
    document.getElementById('modal-establishment-name').innerText = name;
    document.getElementById('form-establishment-name').value = name;
    document.getElementById('booking-modal-overlay').classList.add('active');
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

window.addEventListener('DOMContentLoaded', async () => { 
    await loadHeader(); 
    loadEstablishments(); 
    
    const currentLang = localStorage.getItem('cartel_lang') || 'uk';
    setLanguage(currentLang); 
});

function toggleMenu() { 
    const links = document.getElementById('navbar-links');
    const hamburger = document.getElementById('hamburger-btn');
    if (links) links.classList.toggle('mobile-active'); 
    if (hamburger) hamburger.classList.toggle('open'); 
}