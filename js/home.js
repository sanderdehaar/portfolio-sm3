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