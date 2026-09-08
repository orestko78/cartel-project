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
        document.getElementById('modal-establishment-name').textContent = restaurantName;
        if (menuItems.length === 0) {
            listContainer.innerHTML = '<p class="item-description">У меню поки немає страв.</p>';
            return;
        }
        listContainer.innerHTML = '';
        menuItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            const dishImg = item.image_url ? item.image_url : 'https://unsplash.com';
            itemElement.innerHTML = `
                <img src="${dishImg}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 20px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <div class="item-info"><div class="item-name">${item.name}</div><div class="item-description">${item.description ? item.description : ''}</div></div>
                <div class="item-dots"></div><div class="item-price">${item.price} грн</div>`;
            listContainer.appendChild(itemElement);
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
