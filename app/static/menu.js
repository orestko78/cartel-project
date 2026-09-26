let currentEstablishmentName = "Забронювати стіл";

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
    }
    if (hamburgerBtn) {
        hamburgerBtn.classList.toggle('open');
    }
}

function openModal() {
    const overlay = document.getElementById('booking-modal-overlay');
    const modalSub = document.getElementById('modal-establishment-name');
    
    if (overlay) {
        if (modalSub) {
            modalSub.innerText = currentEstablishmentName;
        }
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

// 🌟 ОЖИВЛЕНА ФУНКЦІЯ: Зберігає замовлення столів зі сторінки меню страв
async function submitBooking(event) {
    event.preventDefault();
    
    const guestName = document.getElementById('guest-name').value;
    const guestPhone = document.getElementById('guest-phone').value;
    const bookingDate = document.getElementById('booking-date').value;

    // Виправлено назви ключів відповідно до схеми BookingCreate
    const bookingData = {
        establishment_name: currentEstablishmentName,
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
            alert(result.message || `Дякуємо, ${guestName}! Ваше бронювання успішно підтверджено.`);
            document.getElementById('booking-form').reset();
            closeModal();
        } else {
            alert(`Помилка під час відправки броні: ${result.detail || 'Збій валідації'}`);
        }
    } catch (error) {
        console.error("Помилка бронювання:", error);
        alert("Збій з'єднання з сервером.");
    }
}

async function loadHeader() {
    try {
        const response = await fetch('/static/header.html');
        if (response.ok) {
            const html = await response.text();
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) placeholder.innerHTML = html;
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

function initCardDropdowns() {
    const cards = document.querySelectorAll('.menu-card-premium');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            this.classList.toggle('active');
        });
    });
}

async function initializeMenuPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const titleMain = document.getElementById('rest-name');
    const heroSection = document.querySelector('.menu-hero');
    const itemsList = document.getElementById('menu-items-list');

    if (!id) {
        if (titleMain) titleMain.innerText = "Заклад не обрано";
        return;
    }

    try {
        const restResponse = await fetch('/api/establishments/');
        if (restResponse.ok) {
            const establishments = await restResponse.json();
            const currentRest = establishments.find(est => est.id == id);
            if (currentRest) {
                currentEstablishmentName = currentRest.name;
                if (titleMain) titleMain.innerText = currentRest.name.toUpperCase();
                
                if (heroSection) {
                    heroSection.style.backgroundImage = `url('${currentRest.image_url || '/static/images/rebra/rebra14.jpg'}')`;
                }
            }
        }

        const menuResponse = await fetch(`/api/menu/${id}`);
        if (!menuResponse.ok) {
            if (itemsList) itemsList.innerHTML = '<p style="color:#aaa; text-align:center; width:100%;">Не вдалося завантажити меню.</p>';
            return;
        }

        const menuItems = await menuResponse.json();

        if (menuItems.length === 0) {
            if (itemsList) itemsList.innerHTML = '<p style="color:#aaa; text-align:center; width:100%;">Для цього закладу меню наразі оновлюється.</p>';
            return;
        }

        let listHtml = "";
        menuItems.forEach(dish => {
            listHtml += `
                <div class="menu-card-premium">
                    <div class="menu-card-bg" style="background-image: url('${dish.image_url || '/static/images/rebra/rebra14.jpg'}');"></div>
                    <div class="menu-card-info-plate">
                        <div class="menu-card-header-line">
                            <h3 class="menu-card-title-premium">${dish.name}</h3>
                            <span class="menu-card-price-premium">${dish.price} UAH</span>
                        </div>
                        <div class="menu-card-dropdown">
                            <p class="menu-card-desc-premium">${dish.description || 'Фірмовий рецепт від шеф-кухаря мережі CARTEL.'}</p>
                        </div>
                        <div class="menu-card-arrow-wrapper">
                            <span class="menu-card-arrow"></span>
                        </div>
                    </div>
                </div>
            `;
        });

        if (itemsList) {
            itemsList.innerHTML = listHtml;
            initCardDropdowns();
        }

    } catch (error) {
        console.error("Критична помилка ініціалізації сторінки меню:", error);
        if (itemsList) itemsList.innerHTML = '<p style="color:red; text-align:center; width:100%;">Сталася помилка при завантаженні контенту.</p>';
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    await loadFooter();
    await initializeMenuPage();
});
