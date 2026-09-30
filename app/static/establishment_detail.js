let lastScrollTop = 0;

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

function setLanguage(lang) {
    localStorage.setItem('cartel_lang', lang);
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
    });

    const btnUk = document.getElementById('lang-uk');
    const btnEn = document.getElementById('lang-en');
    if (btnUk && btnEn) {
        if (lang === 'uk') {
            btnUk.classList.add('active');
            btnEn.classList.remove('active');
        } else {
            btnEn.classList.add('active');
            btnUk.classList.remove('active');
        }
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

async function loadEstablishmentDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    const bgBlock = document.getElementById('establishment-hero-bg');
    const titleBlock = document.getElementById('detail-title');
    const cuisineBlock = document.getElementById('detail-cuisine');
    const container = document.getElementById('establishment-content');
    
    if (!id) {
        if (container) container.innerHTML = '<p style="color:red; text-align: center;">Заклад не знайдено.</p>';
        return;
    }

    try {
        const response = await fetch('/api/establishments/');
        const data = await response.json();
        const item = data.find(est => est.id == id);

        if (!item) {
            if (container) container.innerHTML = '<p style="color:red; text-align: center;">Заклад не знайдено.</p>';
            return;
        }

        const currentLang = localStorage.getItem('cartel_lang') || 'uk';
        
        // Налаштування повноформатного заднього фону
        if (bgBlock && item.image_url) bgBlock.style.backgroundImage = `url('${item.image_url}')`;
        if (titleBlock) titleBlock.innerText = item.name.toUpperCase();
        if (cuisineBlock) cuisineBlock.innerText = item.cuisine || (item.type === 'SPA' ? 'SPA & Wellness' : 'Premium Service');

        let finalDescription = item.description;
        if (!finalDescription || finalDescription === "null" || finalDescription.trim() === "") {
            finalDescription = `<p style="font-size: 16px; line-height: 1.6; color: #ddd; text-align: left;">Опис закладу наразі оновлюється. Скоро тут з'явиться детальна інформація.</p>`;
        }

        if (finalDescription.includes('href="#menu"')) {
            finalDescription = finalDescription.replace('href="#menu"', `href="/menu.html?id=${id}"`);
        }

        // Автоматичне визначення напису кнопки за типом
        let buttonText = "Замовити столик";
        if (item.type === 'Hotel') {
            buttonText = "Забронювати номер";
        } else if (item.type === 'SPA') {
            buttonText = "Забронювати сеанс";
        }

        let mapCode = item.map_iframe || '<p style="color: #aaa; text-align: center; padding: 20px;">Карта тимчасово недоступна</p>';

        // 🌟 ГЕНЕРУЄМО ІДЕАЛЬНУ ПРЕМІУМ ПОСЛІДОВНІСТЬ ВМІСТУ ПЛАШКИ:
        if (container) {
            container.innerHTML = `
                <!-- 1. Кнопки швидких дій (Paris Style) — розташовані СТРОГО НАД текстом опису -->
                <div class="paris-actions" style="display: flex !important; gap: 15px !important; flex-wrap: wrap !important; margin: 10px 0 35px 0 !important; width: 100% !important; background: transparent !important;">
                    <a href="/menu.html?id=${id}" class="paris-link-btn" style="border: 1px solid #d4af37 !important; color: #d4af37 !important; padding: 12px 24px !important; text-decoration: none !important; font-weight: bold !important; border-radius: 4px !important; font-size: 13px !important; text-transform: uppercase !important; letter-spacing: 1px; transition: all 0.3s ease; background: transparent !important;">ПЕРЕГЛЯНУТИ МЕНЮ</a>
                    <a href="#" class="paris-link-btn" onclick="openModal('${item.name}', '${item.type}')" style="border: 1px solid #d4af37 !important; color: #d4af37 !important; padding: 12px 24px !important; text-decoration: none !important; font-weight: bold !important; border-radius: 4px !important; font-size: 13px !important; text-transform: uppercase !important; letter-spacing: 1px; transition: all 0.3s ease; background: transparent !important;">КОНТАКТИ ТА ГОДИНИ РОБОТИ</a>
                </div>

                <!-- 2. Головний довгий опис закладу з бази даних -->
                <div class="establishment-description-content" style="font-size: 16px; line-height: 1.8; color: #e0e0e0; margin-bottom: 35px; text-align: left; background: transparent !important;">
                    ${finalDescription}
                </div>

                <!-- 3. Панель локації, рейтингу та великої кнопки онлайн-резерву -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 25px; flex-wrap: wrap; gap: 20px; margin-bottom: 40px; background: transparent !important;">
                    <div style="text-align: left; background: transparent !important;">
                        <p style="margin: 6px 0 0 0; color: #aaa; font-size: 14px; text-align: left;">★ Рейтинг: <span style="color: #d4af37; font-weight: bold;">${item.rating.toFixed(1)}</span></p>
                    </div>
                        
                    <div style="background: transparent !important;">
                        <button onclick="openModal('${item.name}', '${item.type}')" style="background: #d4af37; color: #000; border: none; padding: 14px 32px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 15px; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.5px;" onmouseover="this.style.background='#fff'" onmouseout="this.style.background='#d4af37'">
                            ${buttonText}
                        </button>
                    </div>
                </div>

                <!-- 🌟 ОНОВЛЕНО: Нова преміум-плашка Адреси з кнопкою та висувною картою -->
                <div class="address-premium-block" style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 30px; width: 100%; background: transparent !important;">
                    
                    <h2 style="font-size: 22px; color: #d4af37; font-family: 'Cormorant Garamond', serif; margin-bottom: 10px; font-weight: 600; letter-spacing: 0.5px;">
                        📍 НАША АДРЕСА
                    </h2>
                    
                    <!-- Динамічний вивід адреси з бази даних -->
                    <p style="font-size: 15px; color: #ffffff; font-family: 'Montserrat', sans-serif; margin-bottom: 20px;">
                        ${item.location || 'Буковель, Івано-Франківська область'}
                    </p>
                    
                    <!-- Золота кнопка-перемикач для карти -->
                    <button onclick="toggleMapDropdown()" class="btn-toggle-map" style="background: transparent; border: 1px solid #d4af37; color: #d4af37; padding: 12px 28px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 13px; font-family: 'Montserrat', sans-serif; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease;">
                        Подивитись на карті ▼
                    </button>

                    <!-- 🔮 Прихований контейнер карти з плавним розгортанням -->
                    <div id="map-dropdown-container" style="max-height: 0px; overflow: hidden; opacity: 0; transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease; margin-top: 0px;">
                        <div class="google-map-wrapper" style="width: 100%; overflow: hidden; border-radius: 12px; line-height: 0; padding-top: 20px;">
                            ${mapCode}
                        </div>
                    </div>

                </div>
            `;
        }

    } catch (err) {
        console.error("Помилка завантаження деталей закладу:", err);
        if (container) container.innerHTML = '<p style="color:red; text-align: center;">Помилка завантаження даних.</p>';
    }
}

// 🌟 ФУНКЦІЯ ДЛЯ ПЛАВНОГО ВИЇЖДЖАННЯ КАРТИ ПРИ КЛІКУ
function toggleMapDropdown() {
    const mapContainer = document.getElementById('map-dropdown-container');
    const toggleBtn = document.querySelector('.btn-toggle-map');
    
    if (!mapContainer || !toggleBtn) return;

    if (mapContainer.style.maxHeight === "0px" || !mapContainer.style.maxHeight) {
        // Розгортаємо карту (задаємо достатню висоту для iframe + відступи)
        mapContainer.style.maxHeight = "500px";
        mapContainer.style.opacity = "1";
        toggleBtn.innerHTML = "Сховати карту ▲";
        toggleBtn.style.background = "rgba(212, 175, 55, 0.1)";
    } else {
        // Плавно згортаємо назад
        mapContainer.style.maxHeight = "0px";
        mapContainer.style.opacity = "0";
        toggleBtn.innerHTML = "Подивитись на карті ▼";
        toggleBtn.style.background = "transparent";
    }
}



window.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    await loadFooter();
    await loadEstablishmentDetail();
});