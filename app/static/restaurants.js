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
        btn_visit: "Зайти до закладу"
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
        btn_visit: "Visit establishment"
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
            
            // Перевіряємо, чи є масив зображень (item.images), інакше використовуємо одиночне фото або дефолтне
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

            // Якщо фотографій більше ніж одна — створюємо слайдер та лінії-перемикачі праворуч
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
                // Якщо фото одне — виводимо звичайний блок без стрілок
                imageSectionHtml = `<div class="card-image" style="background-image: url('${images[0]}');"></div>`;
                sliderControlsHtml = '';
            }
            
            // Перехід на детальну сторінку
            card.innerHTML = `
                ${imageSectionHtml}
                <div class="card-content">
                    <div class="card-header-row">
                        <div class="card-type" data-i18n="card_restaurant">${t.card_restaurant}</div>
                        ${sliderControlsHtml}
                    </div>
                    <div class="card-title">${item.name}</div>
                    <div class="card-cuisine">${item.cuisine ? item.cuisine : 'Преміум сервіс'}</div>
                    <button class="btn-visit" data-i18n="btn_visit">${t.btn_visit}</button>
                    <div class="card-footer">
                        <span>📍 ${item.location}</span>
                        <span class="rating">★ ${item.rating.toFixed(1)}</span>
                    </div>
                </div>`;

            // Обробник кліку на кнопку "Зайти до закладу"
            const visitBtn = card.querySelector('.btn-visit');
            visitBtn.onclick = (event) => {
                event.stopPropagation(); 
                window.location.href = `/static/establishment_detail.html?id=${item.id}`;
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
    await loadFooter(); 
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