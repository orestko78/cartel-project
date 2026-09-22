// Обов'язково оголошуємо змінну на самому початку файлу, щоб вона не губилася
let lastScrollTop = 0;

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

    // Запобігаємо від'ємним значенням при скролі на Mac (Bounce-ефект)
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// 1. Словник перекладів
const translations = {
    uk: {
        nav_about: "Про нас", nav_restaurants: "Ресторани", nav_hotels: "Готелі", nav_spa: "SPA",
        nav_team: "Команда", nav_jobs: "Вакансії", nav_blog: "Блог", nav_contact: "Контакти",
        hotels_hero_title: "Наші готелі у <span>Буковелі</span>",
        hotels_hero_desc: "Затишні номери, високий рівень сервісу та неймовірні пейзажі Карпат для вашого ідеального відпочинку.",
        card_hotel: "🏨 Готель", btn_reserve: "Резерв номера"
    },
    en: {
        nav_about: "About Us", nav_restaurants: "Restaurants", nav_hotels: "Hotels", nav_spa: "SPA",
        nav_team: "Team", nav_jobs: "Careers", nav_blog: "Blog", nav_contact: "Contacts",
        hotels_hero_title: "Our Hotels in <span>Bukovel</span>",
        hotels_hero_desc: "Cozy rooms, high-level service, and incredible Carpathian landscapes for your ideal getaway.",
        card_hotel: "🏨 Hotel", btn_reserve: "Room Reservation"
    }
};

function setLanguage(lang) {
    localStorage.setItem('cartel_lang', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
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

async function loadHotels() {
    try {
        const response = await fetch('/api/establishments/');
        const data = await response.json();
        const grid = document.getElementById('establishments-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const hotels = data.filter(item => item.type && item.type.toLowerCase() === 'hotel');
        if (hotels.length === 0) {
            grid.innerHTML = '<p class="empty-state">Наразі немає доступних готелів.</p>';
            return;
        }

        const currentLang = localStorage.getItem('cartel_lang') || 'uk';
        const t = translations[currentLang] || translations['uk'];

        hotels.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            
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

            const imageUrl = item.image_url ? item.image_url : '/static/images/rebra.jpg';
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${imageUrl}');"></div>
                <div class="card-content">
                    <div class="card-type" data-i18n="card_hotel">${t.card_hotel}</div>
                    <div class="card-title">${item.name}</div>
                    <div class="card-cuisine">${item.cuisine ? item.cuisine : 'Преміум сервіс'}</div>
                    <button class="btn-book-now" data-i18n="btn_reserve">${t.btn_reserve}</button>
                    <div class="card-footer">
                        <span>📍 ${item.location}</span>
                        <span class="rating">★ ${item.rating.toFixed(1)}</span>
                    </div>
                </div>
            `;
            
            const bookBtn = card.querySelector('.btn-book-now');
            bookBtn.onclick = (event) => {
                event.stopPropagation();
                const modalOverlay = document.getElementById('booking-modal-overlay');
                if (modalOverlay) {
                    const modalTitle = document.getElementById('modal-title');
                    if (modalTitle) modalTitle.innerText = 'Резерв номера';
                    document.getElementById('modal-establishment-name').innerText = item.name;
                    document.getElementById('form-establishment-name').value = item.name;
                    modalOverlay.classList.add('active');
                }
            };

            grid.appendChild(card);
        });

        setLanguage(currentLang);

    } catch (error) {
        console.error("Помилка завантаження даних:", error);
    }
}

/* Відправка форми резерву готелю на FastAPI сервер */
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
            alert('Резервацію успішно створено!');
            closeModal();
        } else {
            const errorData = await response.json();
            alert('Помилка при створенні резерву: ' + (errorData.detail || 'Невідома помилка'));
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

function closeModal() {
    document.getElementById('booking-modal-overlay')?.classList.remove('active');
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    await loadFooter(); 
    loadHotels();
    const savedLang = localStorage.getItem('cartel_lang') || 'uk';
    setLanguage(savedLang);
    
    // Прив'язуємо обробник форми бронювання, якщо вона є на сторінці
    document.getElementById('booking-form')?.addEventListener('submit', submitBooking);
});
