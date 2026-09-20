const translations = {
    uk: {
        nav_about: "Про нас", nav_restaurants: "Ресторани", nav_hotels: "Готелі", nav_spa: "SPA",
        nav_team: "Команда", nav_jobs: "Вакансії", nav_blog: "Блог", nav_contact: "Контакти",
        hero_title: 'Мережа ресторанів CARTEL',
        hero_desc: "Вишукана гастрономія, authorські концепції від шеф-кухарів та незабутні смакові поєднання в самому серці Карпат."
    },
    en: {
        nav_about: "About Us", nav_restaurants: "Restaurants", nav_hotels: "Hotels", nav_spa: "SPA",
        nav_team: "Team", nav_jobs: "Careers", nav_blog: "Blog", nav_contact: "Contacts",
        hero_title: "Hotels & Restaurants Network",
        hero_desc: "Premium leisure concepts, exquisite gastronomy, and a legendary atmosphere in the heart of the Carpathians."
    }
};

function setLanguage(lang) {
    localStorage.setItem('cartel_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) element.textContent = translations[lang][key];
    });
    const langUk = document.getElementById('lang-uk');
    const langEn = document.getElementById('lang-en');
    if (langUk && langEn) {
        langUk.classList.remove('active-lang');
        langEn.classList.remove('active-lang');
        document.getElementById('lang-' + lang).classList.add('active-lang');
    }
}

async function loadHeader() {
    try {
        const response = await fetch('/static/header.html');
        if (response.ok) {
            const html = await response.text();
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) placeholder.outerHTML = html;
        } else {
            console.error("Не вдалося завантажити header.html: статус", response.status);
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
        const restaurants = data.filter(item => item.type && item.type.toLowerCase() === 'restaurant');
        if (restaurants.length === 0) {
            grid.innerHTML = '<p class="empty-state">Наразі немає доданих ресторанів. Додайте їх через /docs</p>';
            return;
        }
        restaurants.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Клік по картці веде на сторінку меню страв
            card.onclick = () => { window.location.href = `/static/menu.html?id=${item.id}`; };
            
            // Підстраховка для шляху до картинок статики
            const imageUrl = item.image_url ? item.image_url : '/static/images/rebra.jpg';
            
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${imageUrl}');"></div>
                <div class="card-content">
                    <div class="card-type">🥩 Ресторан</div>
                    <div class="card-title">${item.name}</div>
                    <div class="card-cuisine">${item.cuisine ? item.cuisine : 'Преміум сервіс'}</div>
                    
                    <!-- Додана кнопка швидкого бронювання -->
                    <button class="btn-book-now">Забронювати столик</button>
                    
                    <div class="card-footer">
                        <span>📍 ${item.location}</span>
                        <span class="rating">★ ${item.rating.toFixed(1)}</span>
                    </div>
                </div>`;
            
            // Ізолюємо клік по кнопці "Забронювати", щоб він не переходив на menu.html
            const bookBtn = card.querySelector('.btn-book-now');
            bookBtn.onclick = (event) => {
                event.stopPropagation(); 
                openModal(item.name, 'Restaurant');
            };

            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Помилка завантаження даних:", error);
    }
}

/* Логіка відкриття модального вікна */
function openModal(name, type) {
    const overlay = document.getElementById('booking-modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalEstName = document.getElementById('modal-establishment-name');
    const formEstInput = document.getElementById('form-establishment-name');

    if (modalTitle) modalTitle.innerText = 'Бронювання столика';
    if (modalEstName) modalEstName.innerText = name;
    if (formEstInput) formEstInput.value = name;
    
    if (overlay) overlay.classList.add('active');
}

/* Логіка закриття модального вікна */
function closeModal() {
    const overlay = document.getElementById('booking-modal-overlay');
    if (overlay) overlay.classList.remove('active');
    document.getElementById('booking-form')?.reset();
}

/* Відправка форми бронювання на FastAPI сервер */
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
        alert('Помилка при з’єднанні з сервером. Спробуйте ще раз.');
    }
}

function toggleMenu() {
    document.getElementById('navbar-links')?.classList.toggle('mobile-active');
    document.getElementById('hamburger-btn')?.classList.toggle('open');
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    loadEstablishments();
    setLanguage(localStorage.getItem('cartel_lang') || 'uk');
});