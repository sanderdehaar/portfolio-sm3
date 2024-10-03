// Slider
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('#hero-home .slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    const sliderCount = document.querySelector('.slider_count p:first-child');
    const totalSlidesText = document.querySelector('.slider_count p:last-child');
    const body = document.querySelector('body');

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('is-active');
            if (i === index) {
                slide.classList.add('is-active');

                // Remove the previous project class and add the new one
                const previousClass = Array.from(body.classList).find(className => className.startsWith('project-'));
                if (previousClass) {
                    body.classList.remove(previousClass);
                }
                body.classList.add(`project-${index + 1}`);
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

// GSAP Moving element

const throttled = (delay, fn) => {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}

const movableElementsWrapper = document.querySelector('.movement-wrapper');

const mouseMoveHandler = (e) => {
    const y = e.movementY;
    const x = e.movementX;

    let moveX = x > 0 ? -x : x;
    let moveY = y > 0 ? -y : y;

    const movableElements = document.querySelectorAll('.movable');

    movableElements.forEach(
        (movableElement) => {
            gsap.to(movableElement, { x: moveX, y: moveY, duration: 1 });
        }
    );
};

const mouseMoveHandler2 = (e) => {
    const movableElements = document.querySelectorAll('.movable');

    movableElements.forEach(
        (movableElement) => {
            const shiftValue = movableElement.getAttribute('data-value');
            console.log(shiftValue);
            const moveX = (e.clientX * shiftValue) / 250;
            const moveY = (e.clientY * shiftValue) / 250;

            gsap.to(movableElement, { x: moveX, y: moveY, duration: 1 });
        }
    );
};

const tHandler = throttled(200, mouseMoveHandler2);

const checkViewportAndAddListener = () => {
    if (window.innerWidth > 920) {
        movableElementsWrapper.onmousemove = tHandler;
    } else {
        movableElementsWrapper.onmousemove = null;
    }
};

checkViewportAndAddListener();
window.addEventListener('resize', checkViewportAndAddListener);