const establishmentId = new URLSearchParams(window.location.search).get('id');
let restaurantName = 'Заклад';

async function loadMenu() {
    const listContainer = document.getElementById('menu-items-list');
    if (!establishmentId) {
        document.getElementById('rest-name').textContent = 'Заклад не знайдено';
        listContainer.innerHTML = '<p class="item-description">Відкрийте меню зі сторінки закладів.</p>';
        return;
    }
    try {
        const [establishmentResponse, menuResponse] = await Promise.all([
            fetch('/api/establishments/'), fetch(`/api/menu/${encodeURIComponent(establishmentId)}`)
        ]);
        if (!establishmentResponse.ok || !menuResponse.ok) throw new Error('Не вдалося отримати дані меню');
        const establishments = await establishmentResponse.json();
        const menuItems = await menuResponse.json();
        const establishment = establishments.find(item => String(item.id) === establishmentId);
        restaurantName = establishment?.name || 'Меню закладу';
        document.getElementById('rest-name').textContent = restaurantName;
        
        const modalEstName = document.getElementById('modal-establishment-name');
        if (modalEstName) modalEstName.textContent = restaurantName;
        
        if (menuItems.length === 0) {
            listContainer.innerHTML = '<p class="item-description">У меню поки немає страв.</p>';
            return;
        }
        listContainer.innerHTML = '';
        
                menuItems.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'menu-card-premium'; // Наш преміум-контейнер
                    
                    const dishImg = item.image_url ? item.image_url : '/static/images/rebra.jpg';
                    const dishDesc = item.description ? item.description : 'Авторська страва від шеф-кухаря з використанням локальних карпатських продуктів.';
                    
                    card.innerHTML = `
                        <!-- Верхня частина: Фотографія страви -->
                        <div class="menu-card-bg" style="background-image: url('${dishImg}');"></div>
                        
                        <!-- Нижня плашка: виходить за межі та розгортається -->
                        <div class="menu-card-info-plate">
                            <div class="menu-card-header-line">
                                <h3 class="menu-card-title-premium">${item.name}</h3>
                                <span class="menu-card-price-premium">${item.price} грн</span>
                            </div>
                            
                            <!-- Прихований контейнер для опису, який висувається вниз -->
                            <div class="menu-card-dropdown">
                                <p class="menu-card-desc-premium">${dishDesc}</p>
                            </div>
                            
                            <!-- Тонка лофт-стрілочка строго посередині внизу плашки -->
                            <div class="menu-card-arrow-wrapper">
                                <span class="menu-card-arrow"></span>
                            </div>
                        </div>
                    `;

                    // Логіка кліку: розгортання опису вниз
                    card.onclick = (event) => {
                        // Якщо клікнули на посилання чи кнопку всередині (якщо вони будуть), не чіпаємо
                        if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A') return;
                        
                        // Перемикаємо клас active для плавної анімації висування
                        card.classList.toggle('active');
                    };

                    listContainer.appendChild(card);
                });

    } catch (error) {
        console.error('Помилка завантаження меню:', error);
        document.getElementById('rest-name').textContent = 'Помилка завантаження';
        listContainer.innerHTML = '<p class="item-description">Не вдалося завантажити меню. Спробуйте ще раз.</p>';
    }
}

function openModal() { document.getElementById('booking-modal-overlay').classList.add('active'); }
function closeModal() {
    document.getElementById('booking-modal-overlay').classList.remove('active');
    document.getElementById('booking-form').reset();
}
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
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookingData)
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

window.addEventListener('click', event => {
    if (event.target === document.getElementById('booking-modal-overlay')) closeModal();
});
window.addEventListener('load', loadMenu);
