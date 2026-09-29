let lastScrollTop = 0;

/* Скрол-функція: розумне приховування та поява хедера */
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (!header) return; // Захист від помилок, якщо хедер ще не підвантажився з сервера

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Якщо скролимо вниз і прокрутили більше ніж на 50px — ховаємо хедер
    if (scrollTop > lastScrollTop && scrollTop > 50) {
        header.classList.add('header-hidden');
    } else {
        // Якщо скролимо вгору — показуємо назад
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
                modalTitle.innerText = 'Бронювання СПА сеансу';
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

// 🌟 ФІРМОВИЙ КІНЕМАТОГРАФІЧНИЙ СКРОЛ З ЕФЕКТОМ EASE-IN-OUT ДЛЯ СТОРІНКИ ДЕТАЛЕЙ
function scrollToFormats() {
    // Шукаємо головний контейнер з контентом ресторану
    const targetSection = document.querySelector('.establishment-detail-container') || document.getElementById('establishment-content');
    if (!targetSection) return;

    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1500; // 1.5 секунди для виняткової плавності
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

    // Пом'якшення на початку і в кінці руху (Math ease-in-out)
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
            headers: {
                'Content-Type': 'application/json'
            },
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
        
        if (bgBlock && item.image_url) {
            bgBlock.style.backgroundImage = `url('${item.image_url}')`;
        }
        if (titleBlock) titleBlock.innerText = item.name.toUpperCase();
        if (cuisineBlock) cuisineBlock.innerText = item.cuisine || (item.type === 'SPA' ? 'SPA & Wellness' : 'Premium Service');

        let finalDescription = item.description;
        if (!finalDescription || finalDescription === "null" || finalDescription.trim() === "") {
            finalDescription = `<p style="font-size: 16px; line-height: 1.6; color: #ddd; text-align: left;">Опис закладу наразі оновлюється. Скоро тут з'явиться детальна інформація.</p>`;
        }

        if (finalDescription.includes('href="#menu"')) {
            finalDescription = finalDescription.replace('href="#menu"', `href="/menu.html?id=${id}"`);
        }

        let buttonText = "Замовити столик";
        if (item.type === 'Hotel') {
            buttonText = "Забронювати номер";
        } else if (item.type === 'SPA') {
            buttonText = "Забронювати сеанс";
        }

        let mapCode = item.map_iframe || '<p style="color: #aaa; text-align: center; padding: 20px;">Карта тимчасово недоступна</p>';

        container.innerHTML = `
            <div style="background: rgba(24, 26, 32, 0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); padding: 40px; border-radius: 10px; color: #fff; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 50px rgba(0,0,0,0.6); text-align: left; width: 100%; max-width: 100%; box-sizing: border-box;">
                    ${finalDescription}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px; flex-wrap: wrap; gap: 20px;">
                    <div style="text-align: left;">
                        <p style="margin: 0; color: #aaa; font-size: 14px; text-align: left;">📍 Локація: <span style="color: #fff; font-weight: 500;">${item.location}</span></p>
                        <p style="margin: 6px 0 0 0; color: #aaa; font-size: 14px; text-align: left;">★ Рейтинг: <span style="color: #d4af37; font-weight: bold;">${item.rating.toFixed(1)}</span></p>
                    </div>
                    
                    <div>
                        <button onclick="openModal('${item.name}', '${item.type}')" style="background: #d4af37; color: #000; border: none; padding: 14px 32px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 15px; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.5px;" onmouseover="this.style.background='#fff'" onmouseout="this.style.background='#d4af37'">
                            ${buttonText}
                        </button>
                    </div>
                </div>

                <!-- Блок карти -->
                <div id="map" style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px;">
                    <h2 style="font-size: 22px; color: #d4af37; font-family: 'Cormorant Garamond', serif; margin-bottom: 20px; text-align: left; font-weight: 600; letter-spacing: 0.5px;">
                        РОЗТАШУВАННЯ НА МАПІ
                    </h2>
                    <div class="google-map-wrapper" style="width: 100%; overflow: hidden; border-radius: 10px; line-height: 0;">
                        ${mapCode}
                    </div>
                </div>

            </div>
        `;
    } catch (err) {
        console.error("Помилка завантаження деталей закладу:", err);
        if (container) container.innerHTML = '<p style="color:red; text-align: center;">Помилка завантаження даних.</p>';
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    await loadFooter();
    await loadEstablishmentDetail();
});