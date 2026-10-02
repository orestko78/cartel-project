async function loadHero(bgImageUrl = '') {
    try {
        const response = await fetch('/static/hero.html');
        if (response.ok) {
            const html = await response.text();
            const placeholder = document.getElementById('hero-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;

                const heroContainer = placeholder.querySelector('.site-hero');
                if (heroContainer) {
                    if (bgImageUrl) heroContainer.style.backgroundImage = `url('${bgImageUrl}')`;
                }
            }
        }
    } catch (error) {
        console.error("Помилка завантаження херо-блока:", error);
    }
}

function scrollToFormats() {
    const target = document.querySelector('.establishment-detail-container')
        || document.getElementById('hotels-intro')
        || document.getElementById('restaurants-intro')
        || document.getElementById('establishments-grid')
        || document.getElementById('spa-intro')
        || document.getElementById('spa-grid');
    if (!target) return;

    const startPosition = window.pageYOffset;
    const distance = target.getBoundingClientRect().top;
    const duration = 1500;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        window.scrollTo(0, easeInOutQuad(elapsed, startPosition, distance, duration));
        if (elapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(time, begin, change, total) {
        time /= total / 2;
        if (time < 1) return change / 2 * time * time + begin;
        time--;
        return -change / 2 * (time * (time - 2) - 1) + begin;
    }

    requestAnimationFrame(animation);
}