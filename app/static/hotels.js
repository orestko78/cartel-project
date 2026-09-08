// 1. Словник перекладів
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
        hotels_hero_title: "Наші готелі у Буковелі",
        hotels_hero_desc: "Затишні номери, високий рівень сервісу та неймовірні пейзажі Карпат для вашого ідеального відпочинку."
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
        hotels_hero_title: "Our Hotels in Bukovel",
        hotels_hero_desc: "Cozy rooms, high-level service, and incredible Carpathian landscapes for your ideal getaway."
    }
};

function setLanguage(lang) {
    localStorage.setItem('cartel_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

async function loadHeader() {
    try {
        const response = await fetch('/static/header.html');
        if (response.ok) {
            const html = await response.text();
            document.getElementById('header-placeholder').outerHTML = html;
        }
    } catch (error) {
        console.error("Помилка завантаження шапки:", error);
    }
}

async function loadHotels() {
    try {
        const response = await fetch('/api/establishments/');
        const data = await response.json();
        const grid = document.getElementById('establishments-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const hotels = data.filter(item => item.type === 'Hotel');
        if (hotels.length === 0) {
            grid.innerHTML = '<p class="empty-state">Наразі немає доступних готелів.</p>';
            return;
        }

        hotels.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Перевіряємо як за ID (якщо знаєте точний ID готелю Buka), так і за назвою в будь-якому регістрі
            card.onclick = () => {
                const nameLower = (item.name || '').toLowerCase();
                if (nameLower.includes('mountain residence')) {
                    window.location.href = 'https://mountain-residence.com';
                } else if (nameLower.includes('buka')) {
                    window.location.href = 'https://bukahotel.com.ua';
                } else {
                    window.location.href = `/hotel.html?id=${item.id}`; 
                }
            };

            const imageUrl = item.image_url ? item.image_url : 'https://unsplash.com';
            card.innerHTML = `
                <div class="card-image"></div>
                <div class="card-content">
                    <div class="card-type">🏨 Готель</div>
                    <div class="card-title">${item.name}</div>
                    <div class="card-cuisine">${item.cuisine ? item.cuisine : 'Преміум сервіс'}</div>
                    <div class="card-footer">
                        <span>📍 ${item.location}</span>
                        <span class="rating">★ ${item.rating.toFixed(1)}</span>
                    </div>
                </div>
            `;
            card.querySelector('.card-image').style.backgroundImage = `url('${imageUrl}')`;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Помилка завантаження даних:", error);
    }
}

function toggleMenu() {
    document.getElementById('navbar-links')?.classList.toggle('mobile-active');
    document.getElementById('hamburger-btn')?.classList.toggle('open');
}

function closeModal() {
    document.getElementById('booking-modal-overlay')?.classList.remove('active');
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    loadHotels();
    const savedLang = localStorage.getItem('cartel_lang') || 'uk';
    setLanguage(savedLang);
});
