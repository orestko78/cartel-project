const establishmentId = new URLSearchParams(window.location.search).get('id');
let restaurantName = 'Заклад';

// 🏛️ Динамічне завантаження преміум-шапки CARTEL
async function loadHeader() {
    try {
        const response = await fetch('/static/header.html');
        if (response.ok) {
            const html = await response.text();
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) placeholder.innerHTML = html;
        }
    } catch (error) {
        console.error("Не вдалося підвантажити шапку сайту:", error);
    }
}

// 🏛️ Динамічне завантаження підвалу CARTEL на 5 колонок
async function loadFooter() {
    try {
        const response = await fetch('/static/footer.html');
        if (response.ok) {
            const html = await response.text();
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) placeholder.innerHTML = html;
        }
    } catch (error) {
        console.error("Не вдалося підвантажити підвал сайту:", error);
    }
}

// 🥩 Основна функція завантаження та виведення меню
async function loadMenu() {
    const listContainer = document.getElementById('menu-items-list');
    if (!establishmentId) {
        document.getElementById('rest-name').textContent = 'Заклад не знайдено';
        if (listContainer) {
            listContainer.innerHTML = '<p class="item-description">Відкрийте меню зі сторінки закладів.</p>';
        }
        return;
    }
    
    try {
        // Одночасно стягуємо дані про заклади та страви
        const [establishmentResponse, menuResponse] = await Promise.all([
            fetch('/api/establishments/'), 
            fetch(`/api/menu/${establishmentId}`)
        ]);
        
        if (!establishmentResponse.ok || !menuResponse.ok) {
            throw new Error('Не вдалося отримати дані меню з сервера FastAPI');
        }
        
        const establishments = await establishmentResponse.json();
        const menuItems = await menuResponse.json();
        
        const establishment = establishments.find(item => item.id == establishmentId);
        
        restaurantName = establishment?.name || 'REBRA BBQ';
        
        const restTitleElement = document.getElementById('rest-name');
        if (restTitleElement) {
            restTitleElement.textContent = restaurantName;
        }
        
        const modalEstName = document.getElementById('modal-establishment-name');
        if (modalEstName) {
            modalEstName.textContent = restaurantName;
        }
        
        if (establishment && establishment.image_url) {
            const heroBg = document.querySelector('.menu-hero');
            if (heroBg) {
                heroBg.style.backgroundImage = `url('${establishment.image_url}')`;
            }
        }
        
        if (!listContainer) return;
        
        if (menuItems.length === 0) {
            listContainer.innerHTML = '<p class="item-description">У меню поки немає страв. Додайте їх через /docs</p>';
            return;
        }
        
        listContainer.innerHTML = '';
        
        // Виводимо страви у нашому преміальному лофт-дизайні
        menuItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-card-premium'; 
            
            
            const dishImg = item.image_url ? item.image_url : '/static/images/rebra.jpg';
            const dishDesc = item.description ? item.description : 'Авторська страва від шеф-кухаря з використанням локальних карпатських продуктів.';
            
            card.innerHTML = `
                <!-- Upper section: Dish Image -->
                <div class="menu-card-bg" style="background-image: url('${dishImg}');"></div>
                
                <!-- Lower plate: glassmorphism effect -->
                <div class="menu-card-info-plate">
                    <div class="menu-card-header-line">
                        <h3 class="menu-card-title-premium">${item.name}</h3>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="menu-card-price-premium">${item.price} грн</span>
                            <!-- Clean minimal dropdown arrow indicator -->
                            <div class="menu-card-arrow-wrapper">
                                <span class="menu-card-arrow"></span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Dropdown box for description -->
                    <div class="menu-card-dropdown">
                        <p class="menu-card-desc-premium">${dishDesc}</p>
                    </div>
                </div>
            `;

            // Логіка кліку: плавного розгортання опису вниз
            card.onclick = (event) => {
                if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A') return;
                card.classList.toggle('active');
            };

            listContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error('Помилка завантаження даних:', error);
        const restTitleElement = document.getElementById('rest-name');
        if (restTitleElement) {
            restTitleElement.textContent = 'Помилка завантаження';
        }
        if (listContainer) {
            listContainer.innerHTML = '<p class="item-description">Не вдалося завантажити меню. Спробуйте ще раз.</p>';
        }
    }
}

// Функції керування модальним вікном бронювання
function openModal() { 
    document.getElementById('booking-modal-overlay')?.classList.add('active'); 
}

function closeModal() {
    document.getElementById('booking-modal-overlay')?.classList.remove('active');
    document.getElementById('booking-form')?.reset();
}

// Відправка форми бронювання на FastAPI сервер
async function submitBooking(event) {
    event.preventDefault();
    const bookingData = {
        establishment_name: restaurantName,
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
        const result = await response.json();
        if (!response.ok) throw new Error(result.detail || 'Не вдалося створити бронювання');
        alert(`Бронювання в закладі «${restaurantName}» створено.`);
        closeModal();
    } catch (error) {
        console.error('Помилка відправки замовлення:', error);
        alert(error.message || 'Не вдалося надіслати заявку на сервер.');
    }
}

// Обробник кліку для бургера мобільного меню
function toggleMenu() {
    document.getElementById('navbar-links')?.classList.toggle('mobile-active');
    document.getElementById('hamburger-btn')?.classList.toggle('open');
}

// Закриття модалки при кліку на затемнену вуаль навколо неї
window.addEventListener('click', event => {
    if (event.target === document.getElementById('booking-modal-overlay')) closeModal();
});

// Асинхронно збираємо макет та дані при повному завантаженні сторінки
window.addEventListener('load', async () => {
    await loadHeader(); // Завантажуємо шапку сайту
    await loadFooter(); // Завантажуємо підвал сайту
    loadMenu();         // Рендеримо страви конкретного ресторану
});