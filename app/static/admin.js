async function loadBookings() {
    try {
        const response = await fetch('/api/bookings/');
        const bookings = await response.json();
        const tableBody = document.getElementById('bookings-table-body');
        tableBody.innerHTML = '';
        if (bookings.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="no-data">Наразі немає активних бронювань у базі даних.</td></tr>';
            return;
        }
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            const formattedDate = booking.booking_date.replace('T', ' ');
            row.innerHTML = `
                <td>#${booking.id}</td><td><span class="badge">${booking.establishment_name}</span></td>
                <td style="font-weight: 600;">${booking.guest_name}</td><td>${booking.guest_phone}</td>
                <td><span class="time-badge">${formattedDate}</span></td>
                <td><button class="btn-delete" onclick="deleteBooking(${booking.id})">Видалити</button></td>`;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Помилка завантаження списку:", error);
    }
}

async function deleteBooking(bookingId) {
    if (!confirm(`Ви впевнені, що хочете видалити бронювання #${bookingId}?`)) return;
    try {
        const response = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
        if (response.ok) {
            alert(`Бронювання #${bookingId} успішно видалено!`);
            loadBookings();
        } else {
            alert("Не вдалося видалити замовлення.");
        }
    } catch (error) {
        console.error("Помилка при видаленні:", error);
    }
}

window.addEventListener('load', loadBookings);
setInterval(loadBookings, 20000);
