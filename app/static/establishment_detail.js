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
    
    if (navLinks) {
        navLinks.classList.toggle('mobile-active');
    } else {
        console.error("Помилка: Елемент з id='navbar-links' не знайдено.");
    }
    
    if (hamburgerBtn) {
        hamburgerBtn.classList.toggle('open');
    }
}

function openModal(establishmentName, type) {
    const overlay = document.getElementById('booking-modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalSub = document.getElementById('modal-establishment-name');
    const hiddenInput = document.getElementById('form-establishment-name');

    if (overlay) {
        if (modalTitle) modalTitle.innerText = type === 'Hotel' ? 'Бронювання номера' : 'Бронювання столика';
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
    const container = document.getElementById('establishment-content');
    
    if (!id) {
        container.innerHTML = '<p style="color:red; text-align: center;">Заклад не знайдено.</p>';
        return;
    }

    try {
        const response = await fetch('/api/establishments/');
        const data = await response.json();
        const item = data.find(est => est.id == id);

        if (!item) {
            container.innerHTML = '<p style="color:red; text-align: center;">Заклад не знайдено.</p>';
            return;
        }

        const currentLang = localStorage.getItem('cartel_lang') || 'uk';
        
        let finalDescription = item.description;
        if (!finalDescription || finalDescription === "null" || finalDescription.trim() === "") {
            finalDescription = `<p style="font-size: 16px; line-height: 1.6; color: #ddd; text-align: left;">Опис закладу наразі оновлюється. Скоро тут з'явиться детальна інформація.</p>`;
        }

        if (finalDescription.includes('href="#menu"')) {
            finalDescription = finalDescription.replace('href="#menu"', `href="/menu.html?id=${id}"`);
        }

        // 🌟 SIRREEFFAMA: Koodiin kun amma map_iframe kallattiin kuusaa irraa fudhata
        let mapCode = item.map_iframe || '<p style="color: #aaa; text-align: center;">Карта тимчасово недоступна</p>';

        container.innerHTML = `
            <div style="background: rgba(26, 26, 26, 0.75); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); padding: 40px; border-radius: 12px; color: #fff; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
                <h1 style="font-size: 40px; margin-bottom: 5px; color: #d4af37; font-family: 'Cormorant Garamond', serif; font-weight: 600; text-align: left;">${item.name}</h1>
                <p style="font-size: 16px; color: #aaa; margin-bottom: 25px; text-align: left; padding: 0;">${item.cuisine || (currentLang === 'en' ? 'Network Establishment' : 'Заклад мережі')}</p>
                
                <div style="margin-bottom: 35px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(212,175,55,0.15);">
                    <img src="${item.image_url || '/static/images/rebra.jpg'}" alt="${item.name}" style="width: 100%; max-height: 520px; object-fit: cover; display: block;">
                </div>

                <div class="establishment-description-content">
                    ${finalDescription}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 25px; margin-top: 40px; flex-wrap: wrap; gap: 20px;">
                    <div style="text-align: left;">
                        <p style="margin: 0; color: #aaa; padding: 0; text-align: left;">📍 Локація: <span style="color: #fff;">${item.location}</span></p>
                        <p style="margin: 5px 0 0 0; color: #aaa; padding: 0; text-align: left;">★ Рейтинг: <span style="color: #d4af37;">${item.rating.toFixed(1)}</span></p>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 15px;">
                        <button onclick="openModal('${item.name}', '${item.type}')" style="background: #d4af37; color: #000; border: none; padding: 14px 32px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 16px; transition: background 0.3s; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${item.type === 'Hotel' ? 'Забронювати номер' : 'Замовити столик'}
                        </button>
                    </div>
                </div>

                <!-- 3. Buloora Kaardii Google -->
                <div id="map" style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 30px;">
                    <h2 style="font-size: 26px; color: #d4af37; font-family: 'Cormorant Garamond', serif; margin-bottom: 20px; text-align: left; font-weight: 600;">
                        РОЗТАШУВАННЯ НА МАПІ
                    </h2>
                    <div class="google-map-wrapper" style="width: 100%; overflow: hidden; border-radius: 12px; line-height: 0;">
                        ${mapCode}
                    </div>
                </div>

            </div>
        `;
    } catch (err) {
        console.error("Помилка завантаження деталей закладу:", err);
        container.innerHTML = '<p style="color:red; text-align: center;">Помилка завантаження даних.</p>';
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    await loadFooter();
    await loadEstablishmentDetail();
});
