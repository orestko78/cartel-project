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
        
        container.innerHTML = `
            <div style="background: #1a1a1a; padding: 40px; border-radius: 12px; color: #fff;">
                <h1 style="font-size: 36px; margin-bottom: 10px; color: #d4af37;">${item.name}</h1>
                <p style="font-size: 18px; color: #aaa; margin-bottom: 20px;">${item.cuisine || (currentLang === 'en' ? 'Fine Dining' : 'Ресторан високої кухні')}</p>
                
                <div style="margin-bottom: 30px;">
                    <img src="${item.image_url || (item.images && item.images[0]) || '/static/images/rebra.jpg'}" alt="${item.name}" style="width: 100%; max-height: 500px; object-fit: cover; border-radius: 8px;">
                </div>

                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #ddd;">
                    ${item.description || (currentLang === 'en' ? 'Welcome to our establishment! Enjoy exquisite dishes, atmosphere and impeccable service in the heart of the Carpathians.' : 'Ласкаво просимо до нашого закладу! Насолоджуйтесь вишуканими стравами, атмосферою та бездоганним сервісом у серці Карпат.')}
                </p>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #333; padding-top: 20px; flex-wrap: wrap; gap: 15px;">
                    <div>
                        <p style="margin: 0; color: #aaa;">📍 ${currentLang === 'en' ? 'Location' : 'Локація'}: <span style="color: #fff;">${item.location}</span></p>
                        <p style="margin: 5px 0 0 0; color: #aaa;">${currentLang === 'en' ? 'Rating' : 'Рейтинг'}: <span style="color: #d4af37;">★ ${item.rating.toFixed(1)}</span></p>
                    </div>
                    <button onclick="openModal('${item.name}', 'Restaurant')" style="background: #d4af37; color: #000; border: none; padding: 14px 28px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 16px; transition: background 0.3s;">
                        ${currentLang === 'en' ? 'Book a table' : 'Замовити столик'}
                    </button>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Помилка завантаження деталей закладу:", err);
        container.innerHTML = '<p style="color:red; text-align: center;">Помилка завантаження даних.</p>';
    }
}

// Запускаємо все необхідне при завантаженні сторінки
window.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    await loadFooter();
    loadEstablishmentDetail();
});