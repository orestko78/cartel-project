// =================================================================// 👑 ПРЕМІУМ МУЛЬТИМОВНИЙ СКРИПТ СТОРІНКИ ДЕТАЛЕЙ (ESTABLISHMENT_DETAIL.JS)// =================================================================// 1. СТАТИЧНІ ПЕРЕКЛАДИ ЕЛЕМЕНТІВ (Завжди на початку файлу проти ReferenceError)
const translations = {
    uk: {
        nav_about: "Про нас", nav_restaurants: "Ресторани", nav_hotels: "Готелі", nav_spa: "SPA",
        nav_team: "Команда", nav_jobs: "Вакансії", nav_blog: "Блог", nav_contact: "Контакти",
        btn_view_menu: "ПЕРЕГЛЯНУТИ МЕНЮ", btn_contacts: "КОНТАКТИ ТА ГОДИНИ РОБОТИ",
        btn_map_show: "Подивитись на карті ▼", btn_map_hide: "Сховати карту ▲",
        title_address: "📍 НАША АДРЕСА", text_rating: "★ Рейтинг:",
        btn_order_table: "Замовити столик", btn_book_room: "Забронювати номер", btn_book_spa: "Забронювати сеанс",
        desc_loading: "Опис закладу наразі оновлюється. Скоро тут з'явиться детальна інформація.",
        map_unavailable: "Карта тимчасово недоступна"
    },
    en: {
        nav_about: "About Us", nav_restaurants: "Restaurants", nav_hotels: "Hotels", nav_spa: "SPA",
        nav_team: "Team", nav_jobs: "Careers", nav_blog: "Blog", nav_contact: "Contacts",
        btn_view_menu: "VIEW MENU", btn_contacts: "CONTACTS & HOURS",
        btn_map_show: "View on map ▼", btn_map_hide: "Hide map ▲",
        title_address: "📍 OUR ADDRESS", text_rating: "★ Rating:",
        btn_order_table: "Book a table", btn_book_room: "Book a room", btn_book_spa: "Book a session",
        desc_loading: "The establishment description is currently being updated. Detailed information will appear soon.",
        map_unavailable: "Map is temporarily unavailable"
    }
};

let lastScrollTop = 0;
let currentEstablishment = null; // Глобальна змінна для збереження даних закладу

/* Скрол-функція: розумне приховування та поява хедера */
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (!header) return; 

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 50) {
        header.classList.add('header-hidden');
    } else {
        header.classList.remove('header-hidden');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// 🌍 ФУНКЦІЯ ДИНАМІЧНОГО ПЕРЕКЛАДУ ВЕЛИКОГО ТЕКСТУ ОПИСУ ТА ЕЛЕМЕНТІВ ПЛАШКИ
function renderEstablishmentDescription() {
    if (!currentEstablishment) return;

    const currentLang = localStorage.getItem('cartel_lang') || 'uk';
    const t = translations[currentLang] || translations['uk'];

    // 1. 🧠 ПРЯМИЙ ФІКС КОНТЕЙНЕРА: Отримуємо потрібне мовне поле опису з бази даних
    let finalDescription = currentLang === 'en' ? currentEstablishment.description_en : currentEstablishment.description_uk;
    
    if (!finalDescription || finalDescription === "null" || finalDescription.trim() === "") {
        finalDescription = `<p style="font-size: 16px; line-height: 1.6; color: #ddd; text-align: left;">${t.desc_loading}</p>`;
    }
    
    // Підміна посилання на внутрішнє меню
    if (finalDescription.includes('href="#menu"')) {
        finalDescription = finalDescription.replace('href="#menu"', `href="/menu.html?id=${currentEstablishment.id}"`);
    }

    // 2. 🌟 ВСТАВЛЯЄМО ТЕКСТ БЕЗПОСЕРЕДНЬО У ВАШУ ОРИГІНАЛЬНУ ВЕРСТКУ ПЛАШКИ
    const descContentBlock = document.getElementById('establishment-description-content-block');
    if (descContentBlock) {
        descContentBlock.innerHTML = finalDescription;
    }

    const addressValueEl = document.querySelector('.address-value');
    if (addressValueEl) {
        // Якщо мова англійська — беремо чисте поле location_en, інакше — location_uk
        addressValueEl.innerText = currentLang === 'en' ? currentEstablishment.location_en : currentEstablishment.location_uk;
    }

    // 3. Перекладаємо текст головної золотої кнопки резерву
    const reserveBtn = document.querySelector('.btn-main-reserve');
    if (reserveBtn) {
        let buttonText = t.btn_order_table;
        if (currentEstablishment.type === 'Hotel') {
            buttonText = t.btn_book_room;
        } else if (currentEstablishment.type === 'SPA') {
            buttonText = t.btn_book_spa;
        }
        reserveBtn.innerText = buttonText;
    }

    // 4. Перекладаємо статичні текстові блоки плашки адреси та кнопок
    const ratingLabel = document.querySelector('.rating-label-text');
    if (ratingLabel) ratingLabel.innerHTML = `${t.text_rating} <span style="color: #d4af37; font-weight: bold;">${currentEstablishment.rating.toFixed(1)}</span>`;

    const addressTitle = document.querySelector('.address-title-text');
    if (addressTitle) addressTitle.innerText = t.title_address;

    const menuBtn = document.querySelector('.btn-menu-link');
    if (menuBtn) menuBtn.innerText = t.btn_view_menu;

    const contactBtn = document.querySelector('.btn-contact-link');
    if (contactBtn) contactBtn.innerText = t.btn_contacts;

    // Коригуємо мову на кнопці карти
    const mapContainer = document.getElementById('map-dropdown-container');
    const toggleBtn = document.querySelector('.btn-toggle-map');
    if (mapContainer && toggleBtn) {
        if (mapContainer.style.maxHeight === "0px" || !mapContainer.style.maxHeight) {
            toggleBtn.innerHTML = t.btn_map_show;
        } else {
            toggleBtn.innerHTML = t.btn_map_hide;
        }
    }
}

function setLanguage(lang) {
    localStorage.setItem('cartel_lang', lang);
    
    // Перекладаємо статичні елементи з атрибутом data-i18n
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

    // 🌟 ЗАЛІЗОБЕТОННА ПІДСТРАХОВКА: Оновлюємо опис ресторану ТІЛЬКИ якщо дані вже завантажились із бази
    if (currentEstablishment) {
        renderEstablishmentDescription();
    }
}

function toggleMenu() {
    const navLinks = document.getElementById('navbar-links');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (navLinks) navLinks.classList.toggle('mobile-active');
    if (hamburgerBtn) hamburgerBtn.classList.toggle('open');
}

function openModal(establishmentName, type) {
    const overlay = document.getElementById('booking-modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalSub = document.getElementById('modal-establishment-name');
    const hiddenInput = document.getElementById('form-establishment-name');

    if (overlay) {
        if (modalTitle) {
            if (type === 'Hotel') {
                modalTitle.innerText = 'Бронювання номера';
            } else if (type === 'SPA') {
                modalTitle.innerText = 'Бронювання сеансу СПА';
            } else {
                modalTitle.innerText = 'Бронювання столика';
            }
        }
        
        if (modalSub) modalSub.innerText = establishmentName;
        if (hiddenInput) hiddenInput.value = establishmentName;
        
        overlay.classList.add('active');
        overlay.style.display = 'flex';
    }
}

function closeModal() {
    const overlay = document.getElementById('booking-modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
    }
}

function scrollToFormats() {
    const targetSection = document.querySelector('.establishment-detail-container') || document.getElementById('establishment-content');
    if (!targetSection) return;

    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1500; 
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

async function submitBooking(event) {
    event.preventDefault();

    const establishmentName = document.getElementById('form-establishment-name').value;
    const guestName = document.getElementById('guest-name').value;
    const guestPhone = document.getElementById('guest-phone').value;
    const bookingDate = document.getElementById('booking-date').value;

    const bookingData = {
        establishment_name: establishmentName,
        guest_name: guestName,
        guest_phone: guestPhone,
        booking_date: bookingDate
    };

    try {
        const response = await fetch('/api/bookings/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || `Дякуємо, ${guestName}! Бронювання прийнято.`);
            document.getElementById('booking-form').reset();
            closeModal();
        } else {
            alert(`Помилка: ${result.detail || 'Не вдалося виконати бронювання.'}`);
        }
    } catch (error) {
        console.error("Критична помилка відправки форми:", error);
        alert("Збій з'єднання з сервером. Спробуйте пізніше.");
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
            if (placeholder) placeholder.innerHTML = html;
        }
    } catch (error) {
        console.error("Помилка завантаження підвалу:", error);
    }
}

// 🌍 ФУНКЦІЯ ДИНАМІЧНОГО ПЕРЕКЛАДУ ВЕЛИКОГО ТЕКСТУ ОПИСУ ТА ЕЛЕМЕНТІВ ПЛАШКИ
function renderEstablishmentDescription() {
    if (!currentEstablishment) return;

    const currentLang = localStorage.getItem('cartel_lang') || 'uk';
    const t = translations[currentLang] || translations['uk'];

    // 1. 🧠 ПРЯМИЙ ФІКС КОНТЕЙНЕРА: Отримуємо потрібне мовне поле опису з бази даних
    let finalDescription = currentLang === 'en' ? currentEstablishment.description_en : currentEstablishment.description_uk;
    
    if (!finalDescription || finalDescription === "null" || finalDescription.trim() === "") {
        finalDescription = `<p style="font-size: 16px; line-height: 1.6; color: #ddd; text-align: left;">${t.desc_loading}</p>`;
    }
    
    // Підміна посилання на внутрішнє меню
    if (finalDescription.includes('href="#menu"')) {
        finalDescription = finalDescription.replace('href="#menu"', `href="/menu.html?id=${currentEstablishment.id}"`);
    }

    // 2. 🌟 ВСТАВЛЯЄМО ТЕКСТ БЕЗПОСЕРЕДНЬО У ВАШУ ОРИГІНАЛЬНУ ВЕРСТКУ ПЛАШКИ
    const descContentBlock = document.getElementById('establishment-description-content-block');
    if (descContentBlock) {
        descContentBlock.innerHTML = finalDescription;
    }

    // 🌟 2.5. БЕЗДОГАННИЙ ФІКС МУЛЬТИМОВНОЇ АДРЕСИ НАПРЯМУ З БАЗИ ДАНИХ (БЕЗ ПОШУКІВ ТЕКСТУ)
    const addressValueEl = document.querySelector('.address-value');
    if (addressValueEl) {
        // Якщо мова англійська — беремо чисте поле location_en, інакше — location_uk
        addressValueEl.innerText = currentLang === 'en' ? currentEstablishment.location_en : currentEstablishment.location_uk;
    }

    // 3. Перекладаємо текст головної золотої кнопки резерву
    const reserveBtn = document.querySelector('.btn-main-reserve');
    if (reserveBtn) {
        let buttonText = t.btn_order_table;
        if (currentEstablishment.type === 'Hotel') {
            buttonText = t.btn_book_room;
        } else if (currentEstablishment.type === 'SPA') {
            buttonText = t.btn_book_spa;
        }
        reserveBtn.innerText = buttonText;
    }

    // 4. Перекладаємо статичні текстові блоки плашки адреси та кнопок
    const ratingLabel = document.querySelector('.rating-label-text');
    if (ratingLabel) ratingLabel.innerHTML = `${t.text_rating} <span style="color: #d4af37; font-weight: bold;">${currentEstablishment.rating.toFixed(1)}</span>`;

    const addressTitle = document.querySelector('.address-title-text');
    if (addressTitle) addressTitle.innerText = t.title_address;

    const menuBtn = document.querySelector('.btn-menu-link');
    if (menuBtn) menuBtn.innerText = t.btn_view_menu;

    const contactBtn = document.querySelector('.btn-contact-link');
    if (contactBtn) contactBtn.innerText = t.btn_contacts;

    // Коригуємо мову на кнопці карти
    const mapContainer = document.getElementById('map-dropdown-container');
    const toggleBtn = document.querySelector('.btn-toggle-map');
    if (mapContainer && toggleBtn) {
        if (mapContainer.style.maxHeight === "0px" || !mapContainer.style.maxHeight) {
            toggleBtn.innerHTML = t.btn_map_show;
        } else {
            toggleBtn.innerHTML = t.btn_map_hide;
        }
    }
}


// 🏛️ ВАША ФУНКЦІЯ ЗАВАНТАЖЕННЯ ДЕТАЛЕЙ З ОФІЦІЙНИМ МУЛЬТИМОВНИМ КАРКАСОМ
async function loadEstablishmentDetail() {
    console.log("🚀 Скрипт loadEstablishmentDetail запущен!");
    
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    console.log("🔍 Полученный ID из URL:", id);
    
    const bgBlock = document.getElementById('establishment-hero-bg');
    const container = document.getElementById('establishment-content');
    
    const titleBlock = document.getElementById('detail-title');
    const cuisineBlock = document.getElementById('detail-cuisine');
    
    if (!id) {
        console.error("❌ Критическая ошибка: ID не найден в адресной строке!");
        if (container) container.innerHTML = 'Заклад не знайдено.';
        return;
    }
    
    try {
        console.log("🌐 Отправляем запрос к API /api/establishments/...");
        const response = await fetch('/api/establishments/');
        const data = await response.json();
        console.log("📦 Данные успешно получены от сервера API:", data);
        
        currentEstablishment = data.find(est => est.id == id);
        console.log("🎯 Найденный объект заведения в базе данных:", currentEstablishment);
        
        if (!currentEstablishment) {
            console.error(`❌ Критическая ошибка: Заведение с ID ${id} отсутствует в базе данных!`);
            if (container) container.innerHTML = 'Заклад не знайдено.';
            return;
        }
        
        const currentLang = localStorage.getItem('cartel_lang') || 'uk';
        const t = translations[currentLang] || translations['uk'];
        
        if (bgBlock && currentEstablishment.image_url) {
            bgBlock.style.backgroundImage = `url('${currentEstablishment.image_url}')`;
        }
        
        if (titleBlock) titleBlock.innerText = currentEstablishment.name.toUpperCase();
        if (cuisineBlock) cuisineBlock.innerText = currentEstablishment.cuisine || (currentEstablishment.type === 'SPA' ? 'SPA & Wellness' : 'Premium Service');
        
        let buttonText = t.btn_order_table;
        if (currentEstablishment.type === 'Hotel') buttonText = t.btn_book_room;
        else if (currentEstablishment.type === 'SPA') buttonText = t.btn_book_spa;

        let mapCode = currentEstablishment.map_iframe || `<p style="color: #aaa; text-align: center; padding: 20px;">${t.map_unavailable}</p>`;
        
        console.log("🧱 Начинаем рендеринг HTML-каркаса плашки...");
        if (container) {
            container.innerHTML = `
                <div class="establishment-info-card" style="width: 100% !important; background: transparent !important;">
                    
                    <h1 style="font-family: 'Cinzel', serif !important; font-size: 32px !important; font-weight: 700 !important; color: #ffffff !important; letter-spacing: 2px !important; text-transform: uppercase !important; text-shadow: 0 4px 15px rgba(0,0,0,0.8) !important; margin-bottom: 5px !important; text-align: center !important; line-height: 1.3 !important;">
                        ${currentEstablishment.name.toUpperCase()}
                    </h1>
                    
                    <p style="font-family: 'Cormorant Garamond', serif !important; font-size: 18px !important; color: #d4af37 !important; text-align: center !important; margin: 0 0 30px 0 !important; letter-spacing: 1px !important; font-style: italic !important;">
                        ${currentEstablishment.cuisine || (currentEstablishment.type === 'SPA' ? 'SPA & Wellness' : 'Premium Service')}
                    </p>

                    <div class="info-row" style="display: flex !important; gap: 15px !important; flex-wrap: wrap !important; justify-content: center !important; margin-bottom: 35px !important; width: 100% !important;">
                        <a href="/menu.html?id=${currentEstablishment.id}" class="btn-menu-link" style="border: 1px solid #d4af37 !important; color: #d4af37 !important; padding: 12px 24px !important; text-decoration: none !important; font-weight: bold !important; border-radius: 4px !important; font-size: 13px !important; text-transform: uppercase !important; letter-spacing: 1px !important; transition: all 0.3s ease !important; background: transparent !important; display: inline-block !important;">
                            ${t.btn_view_menu}
                        </a>
                        <a href="#" class="btn-contact-link" onclick="openModal('${currentEstablishment.name}', '${currentEstablishment.type}')" style="border: 1px solid #d4af37 !important; color: #d4af37 !important; padding: 12px 24px !important; text-decoration: none !important; font-weight: bold !important; border-radius: 4px !important; font-size: 13px !important; text-transform: uppercase !important; letter-spacing: 1px !important; transition: all 0.3s ease !important; background: transparent !important; display: inline-block !important;">
                            ${t.btn_contacts}
                        </a>
                    </div>
                    
                    <div id="establishment-description-content-block" style="font-size: 16px !important; line-height: 1.8 !important; color: #e0e0e0 !important; margin: 25px 0 !important; text-align: left !important; background: transparent !important; width: 100% !important;"></div>

                    <div style="display: flex !important; justify-content: space-between !important; align-items: center !important; border-top: 1px solid rgba(255,255,255,0.08) !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; padding: 20px 0 !important; margin: 25px 0 !important; flex-wrap: wrap !important; gap: 15px !important; width: 100% !important; background: transparent !important;">
                        <div style="text-align: left !important; background: transparent !important;">
                            <p class="rating-label-text" style="margin: 0 !important; color: #aaa !important; font-size: 14px !important; font-family: 'Montserrat', sans-serif !important;">
                                ${t.text_rating} <span style="color: #d4af37 !important; font-weight: bold !important;">${currentEstablishment.rating.toFixed(1)}</span>
                            </p>
                        </div>
                        <div style="background: transparent !important;">
                            <button class="btn-main-reserve" onclick="openModal('${currentEstablishment.name}', '${currentEstablishment.type}')" style="background: #d4af37 !important; color: #000000 !important; border: none !important; padding: 14px 32px !important; font-weight: bold !important; border-radius: 6px !important; cursor: pointer !important; font-size: 14px !important; font-family: 'Montserrat', sans-serif !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; transition: all 0.3s !important;" onmouseover="this.style.background='#fff'" onmouseout="this.style.background='#d4af37'">
                                ${buttonText}
                            </button>
                        </div>
                    </div>

                    <div class="address-row" style="width: 100% !important; text-align: left !important; margin-bottom: 15px !important; background: transparent !important;">
                        <span class="address-title-text" style="display: block !important; font-size: 20px !important; color: #d4af37 !important; font-family: 'Cormorant Garamond', serif !important; margin-bottom: 5px !important; font-weight: 600 !important; letter-spacing: 0.5px !important;">
                            ${t.title_address}
                        </span>
                        <span class="address-value" style="font-size: 15px !important; color: #ffffff !important; font-family: 'Montserrat', sans-serif !important;">
                            ${currentEstablishment.location || 'Буковель, Івано-Франківська область'}
                        </span>
                    </div>
                    
                    <div class="map-toggle-wrapper" style="width: 100% !important; text-align: left !important; background: transparent !important;">
                        <button class="btn-toggle-map" onclick="toggleMapDropdown()" style="background: transparent !important; border: 1px solid #d4af37 !important; color: #d4af37 !important; padding: 12px 28px !important; font-weight: bold !important; border-radius: 6px !important; cursor: pointer !important; font-size: 13px !important; font-family: 'Montserrat', sans-serif !important; text-transform: uppercase !important; letter-spacing: 1px !important; transition: all 0.3s ease !important;">
                            ${t.btn_map_show}
                        </button>
                        <div id="map-dropdown-container" class="map-dropdown" style="max-height: 0px; opacity: 0; overflow: hidden; transition: all 0.4s ease; background: transparent !important;">
                            <div style="border-radius: 12px !important; overflow: hidden !important; margin-top: 15px !important; line-height: 0 !important;">
                                ${mapCode}
                            </div>
                        </div>
                    </div>

                </div>
            `;
            console.log("✅ Каркас плашки успешно вмонтирован в DOM!");
        } else {
            console.error("❌ Критическая ошибка: Элемент с id='establishment-content' не найден в вашем HTML!");
        }
        
        console.log("📢 Вызываем renderEstablishmentDescription()...");
        renderEstablishmentDescription();
    } catch (err) {
        console.error("❌ Перехват ошибки внутри блока catch:", err);
        if (container) container.innerHTML = 'Помилка завантаження даних.';
    }
}



// 🌟 ФУНКЦІЯ ДЛЯ ПЛАВНОГО ВИЇЖДЖАННЯ КАРТИ ПРИ КЛІКУ
function toggleMapDropdown() {
    const mapContainer = document.getElementById('map-dropdown-container');
    const toggleBtn = document.querySelector('.btn-toggle-map');
    if (!mapContainer || !toggleBtn) return;
    
    const currentLang = localStorage.getItem('cartel_lang') || 'uk';
    const t = translations[currentLang] || translations['uk'];
    
    if (mapContainer.style.maxHeight === "0px" || !mapContainer.style.maxHeight) {
        mapContainer.style.maxHeight = "500px";
        mapContainer.style.opacity = "1";
        toggleBtn.innerHTML = t.btn_map_hide;
        toggleBtn.style.background = "rgba(212, 175, 55, 0.1)";
    } else {
        mapContainer.style.maxHeight = "0px";
        mapContainer.style.opacity = "0";
        toggleBtn.innerHTML = t.btn_map_show;
        toggleBtn.style.background = "transparent";
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    await loadFooter();
    await loadEstablishmentDetail();
});