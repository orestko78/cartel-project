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

// 🌟 ФУНКЦІЯ ПЕРЕМИКАННЯ КАТЕГОРІЙ НА ЕКРАНІ
function switchCategory(targetCatId, clickedButton) {
    // 1. Змиваємо підсвічування з усіх кнопок
    const buttons = document.querySelectorAll('.category-tab-btn');
    buttons.forEach(btn => {
        btn.style.color = '#a5a7ab';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        btn.style.background = 'rgba(255, 255, 255, 0.02)';
        btn.style.boxShadow = 'none';
    });

    // 2. Додаємо золоте неонове підсвічування для активної кнопки
    if (clickedButton) {
        clickedButton.style.color = '#fff';
        clickedButton.style.borderColor = '#d4af37';
        clickedButton.style.background = 'rgba(212, 175, 55, 0.1)';
        clickedButton.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.2)';
    }

    // 3. Перемикаємо видимість самих блоків зі стравами
    const blocks = document.querySelectorAll('.menu-category-block');
    blocks.forEach(block => {
        if (targetCatId === 'all') {
            block.style.display = 'block'; // Показати все
        } else if (block.getAttribute('data-cat-id') === targetCatId) {
            block.style.display = 'block'; // Показати тільки вибрану
        } else {
            block.style.display = 'none';  // Приховати інші
        }
    });
}

async function initializeMenuPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const titleMain = document.getElementById('rest-name');
    const heroSection = document.querySelector('.menu-hero');
    const categoriesContainer = document.getElementById('menu-categories-container');
    
    // Контейнер для вкладок-кнопок
    const tabsContainer = document.getElementById('menu-categories-tabs');

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
            if (categoriesContainer) categoriesContainer.innerHTML = '<p style="color:#aaa; text-align:center;">Не вдалося завантажити меню.</p>';
            return;
        }

        const menuItems = await menuResponse.json();

        if (menuItems.length === 0) {
            if (categoriesContainer) categoriesContainer.innerHTML = '<p style="color:#aaa; text-align:center;">Для цього закладу меню наразі оновлюється.</p>';
            return;
        }

        // Групуємо страви за категоріями
        const categories = {};
        menuItems.forEach(dish => {
            const catName = dish.category || "Основні страви";
            if (!categories[catName]) {
                categories[catName] = [];
            }
            categories[catName].push(dish);
        });

        // 🌟 1. ГЕНЕРУЄМО КНОПКИ КАТЕГОРІЙ (TABS) У ВЕРХНІЙ РЯДОК
        let tabsHtml = `
            <button class="category-tab-btn" onclick="switchCategory('all', this)" style="border: 1px solid #d4af37; color: #fff; background: rgba(212, 175, 55, 0.1); box-shadow: 0 0 15px rgba(212, 175, 55, 0.2); padding: 12px 28px; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 30px; cursor: pointer; transition: all 0.3s ease;">
                УСЕ МЕНЮ
            </button>
        `;

        Object.keys(categories).forEach((catTitle, idx) => {
            const catId = `cat-${idx}`;
            
            tabsHtml += `
                <button class="category-tab-btn" onclick="switchCategory('${catId}', this)" style="border: 1px solid rgba(255,255,255,0.1); color: #a5a7ab; background: rgba(255,255,255,0.02); padding: 12px 28px; font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 30px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.borderColor='#d4af37'; this.style.color='#fff';" onmouseout="if(this.style.backgroundColor!=='rgba(212, 175, 55, 0.1)'){ this.style.borderColor='rgba(255,255,255,0.1)'; this.style.color='#a5a7ab'; }">
                    ${catTitle}
                </button>
            `;
        });
        
        if (tabsContainer) {
            tabsContainer.innerHTML = tabsHtml;

            // 🌟 ПРИМУСОВЕ ВИРІВНЮВАННЯ В РЯД (ГЕНЕРУЄ ХОДОГЕННИЙ СКРОЛ, ПРОБИВАЮЧИ КЕШ)
            tabsContainer.style.display = "flex";
            tabsContainer.style.flexDirection = "row";
            tabsContainer.style.justifyContent = "flex-start";
            tabsContainer.style.alignItems = "center";
            tabsContainer.style.gap = "12px";
            tabsContainer.style.overflowX = "auto";       /* Вмикає горизонтальну прокрутку */
            tabsContainer.style.overflowY = "hidden";     /* Вимикає вертикальне зміщення */
            tabsContainer.style.whiteSpace = "nowrap";    /* Забороняє перенесення кнопок вниз */
            tabsContainer.style.width = "100%";
            tabsContainer.style.padding = "15px 5px";
            tabsContainer.style.boxSizing = "border-box";
            
            // Приховуємо нативний негарний системний повзунок скролбару
            tabsContainer.style.scrollbarWidth = "none";  /* Для Firefox */
            
            // Гарантуємо, що текст у кнопках ніколи не стиснеться
            const allTabButtons = tabsContainer.querySelectorAll('.category-tab-btn');
            allTabButtons.forEach(btn => {
                btn.style.flexShrink = "0";
                btn.style.display = "inline-block";
                btn.style.whiteSpace = "nowrap";
            });
        }

        // 🌟 2. ГЕНЕРУЄМО БЛОКИ ЗІ СТРАВАМИ ДЛЯ КОЖНОЇ КАТЕГОРІЇ
        let finalHtml = "";
        Object.keys(categories).forEach((catTitle, idx) => {
            const catId = `cat-${idx}`;
            
            finalHtml += `
                <div class="menu-category-block" data-cat-id="${catId}" style="width: 100%; margin-top: 20px; margin-bottom: 20px; display: block; transition: all 0.4s ease;">
                    <h2 style="font-family: 'Cormorant Garamond', serif; font-size: 34px; color: #d4af37; text-align: left; text-transform: uppercase; border-bottom: 1px solid rgba(212, 175, 55, 0.25); padding-bottom: 12px; font-weight: 700; letter-spacing: 2px; margin-bottom: 30px;">
                        ${catTitle}
                    </h2>
                    
                    <div class="category-dishes-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 60px 30px; width: 100%;">
            `;

            categories[catTitle].forEach(dish => {
                finalHtml += `
                        <div class="menu-card-premium">
                            <div class="menu-card-bg" style="background-image: url('${dish.image_url || '/static/images/rebra/rebra14.jpg'}');"></div>
                            <div class="menu-card-info-plate">
                                <div class="menu-card-header-line">
                                    <h3 class="menu-card-title-premium">${dish.name}</h3>
                                    <span class="menu-card-price-premium">${dish.price} UAH</span>
                                </div>
                                <div class="menu-card-dropdown">
                                    <p class="menu-card-desc-premium">${dish.description || 'Фирмовий рецепт від шеф-кухаря мережі CARTEL.'}</p>
                                </div>
                                <div class="menu-card-arrow-wrapper">
                                    <span class="menu-card-arrow"></span>
                                </div>
                            </div>
                        </div>
                `;
            });

            finalHtml += `
                    </div>
                </div>
            `;
        });

        if (categoriesContainer) {
            categoriesContainer.innerHTML = finalHtml;
            initCardDropdowns();
        }

    } catch (error) {
        console.error("Помилка ініціалізації меню:", error);
        if (categoriesContainer) categoriesContainer.innerHTML = '<p style="color:red; text-align:center;">Сталася помилка при завантаженні контенту.</p>';
    }
}


window.addEventListener('DOMContentLoaded', async () => {
    await loadHeader();
    await loadFooter();
    await initializeMenuPage();
});
