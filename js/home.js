// Movement delay
const throttled = (delay, fn) => {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall < delay) return;
        lastCall = now;
        return fn(...args);
    };
};

// Moving items
const wrapper = document.querySelector('.movement-wrapper');

// Mouse movement
const mouseMoveHandler = (e) => {
    const moveX = e.movementX > 0 ? -e.movementX : e.movementX;
    const moveY = e.movementY > 0 ? -e.movementY : e.movementY;

    document.querySelectorAll('.movable').forEach((el) => {
        gsap.to(el, {x: moveX, y: moveY, duration: 1});
    });
};

// Paralax movement
const mouseMoveHandler2 = (e) => {
    if (window.innerWidth > 920) { // Only execute if window width is greater than 920px
        document.querySelectorAll('.movable').forEach((el) => {
            const shift = el.getAttribute('data-value');
            const moveX = (e.clientX * shift) / 150;
            const moveY = (e.clientY * shift) / 150;

            gsap.to(el, {x: moveX, y: moveY, duration: 0.6});
        });
    }
};


// Reset positions
const reset = () => {
    if (window.innerWidth <= 920) {
        document.querySelectorAll('.movable').forEach((el) => {
            gsap.to(el, {x: 0, y: 0, duration: 0});
        });
    }
};

// Throttled handler
const throttledHandler = throttled(200, mouseMoveHandler2);
wrapper.onmousemove = throttledHandler;

window.addEventListener('resize', reset);

// Slider
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('#hero-home .slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    const line = document.querySelector('.progress');
    const sliderCount = document.querySelector('.slider_count p:first-child');
    const totalSlidesText = document.querySelector('.slider_count p:last-child');

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('is-active');
            if (i === index) {
                slide.classList.add('is-active');

                // Set the height
                line.style.height = '70px';

                // Reset Height
                setTimeout(() => {
                    line.style.transition = 'none'; // Disable the transition
                    line.style.height = '0px';

                    // Re-enable the transition
                    setTimeout(() => {
                        line.style.transition = 'height 10s linear';
                    }, 50);
                }, 9900);
            }
        });
        updateSliderCount(index);
    }

    function updateSliderCount(index) {
        sliderCount.innerText = index + 1;
        totalSlidesText.innerText = totalSlides;
    }

    // Auto slide every 10 seconds
    setInterval(nextSlide, 10000);

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }
    showSlide(currentIndex);
});