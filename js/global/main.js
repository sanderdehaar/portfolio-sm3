const cursor = document.querySelector('#cursor');
const cursorCircle = cursor.querySelector('.cursor__circle');

const mouse = { x: -100, y: -100 }; // mouse pointer's coordinates
const pos = { x: 0, y: 0 }; // cursor's coordinates
const speed = 0.1;

const updateCoordinates = e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

window.addEventListener('mousemove', updateCoordinates);


function getAngle(diffX, diffY) {
  return Math.atan2(diffY, diffX) * 180 / Math.PI;
}

function getSqueeze(diffX, diffY) {
  const distance = Math.sqrt(
    Math.pow(diffX, 2) + Math.pow(diffY, 2)
  );
  const maxSqueeze = 0.15;
  const accelerator = 1500;
  return Math.min(distance / accelerator, maxSqueeze);
}


const updateCursor = () => {
  const diffX = Math.round(mouse.x - pos.x);
  const diffY = Math.round(mouse.y - pos.y);
  
  pos.x += diffX * speed;
  pos.y += diffY * speed;
  
  const angle = getAngle(diffX, diffY);
  const squeeze = getSqueeze(diffX, diffY);
  
  const scale = 'scale(' + (1 + squeeze) + ', ' + (1 - squeeze) +')';
  const rotate = 'rotate(' + angle +'deg)';
  const translate = 'translate3d(' + pos.x + 'px ,' + pos.y + 'px, 0)';

  cursor.style.transform = translate;
  cursorCircle.style.transform = rotate + scale;
};

function loop() {
  updateCursor();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

const cursorModifiers = document.querySelectorAll('[cursor-class]');
console.log(cursorModifiers)

cursorModifiers.forEach(curosrModifier => {
  curosrModifier.addEventListener('mouseenter', function() {
    const className = this.getAttribute('cursor-class');
    cursor.classList.add(className);
  });
  
  curosrModifier.addEventListener('mouseleave', function() {
    const className = this.getAttribute('cursor-class');
    cursor.classList.remove(className);
  });
});

// Menu

const navigationLinks = document.querySelectorAll('nav a');
const navigationLinksMenu = document.querySelectorAll('.navigation-items li');
console.log(navigationLinks)
const menu = document.getElementById("menu");
const body = document.body;

function toggleMenu() {
    if (menu.classList.contains('is-active')) {
        menu.classList.remove('is-active');
        body.classList.remove('disable-scroll');
    } else {
        if (this.classList.contains('menu')) {
            menu.classList.add('is-active');
            body.classList.add('disable-scroll');
        }
    }
}

navigationLinks.forEach(link => link.addEventListener('click', toggleMenu));
navigationLinksMenu.forEach(link => link.addEventListener('click', toggleMenu));

function adjustHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', adjustHeight);
adjustHeight();

// animation
window.addEventListener("load", () => {
  const splitWords = (selector) => {
    document.querySelectorAll(selector).forEach(el => {
      el.dataset.splitText = el.textContent;
      el.innerHTML = el.textContent.split(/\s/).map(word =>
        word.split("-").map(w => `<span class="word">${w}</span>`).join('<span class="hyphen">-</span>')
      ).join('<span class="whitespace"> </span>');
    });
  };

  const splitLines = (selector) => {
    const elements = document.querySelectorAll(selector);
    splitWords(selector);
    elements.forEach(el => {
      const lines = getLines(el);
      el.innerHTML = lines.map(wordsArr => `<span class="line"><span class="words">${Array.from(wordsArr).map(w => w.outerHTML).join('')}</span></span>`).join('');
    });
  };

  const getLines = (el) => {
    const lines = [];
    let line, lastTop;
    el.querySelectorAll("span").forEach(word => {
      if (word.offsetTop !== lastTop) {
        if (!word.classList.contains("whitespace")) {
          lastTop = word.offsetTop;
          line = [];
          lines.push(line);
        }
      }
      line.push(word);
    });
    return lines;
  };

  splitLines(".reveal-text");

  const revealText = document.querySelectorAll(".reveal-text");
  gsap.registerPlugin(ScrollTrigger);

  const animateText = (elements) => {
    elements.forEach(element => {
      const lines = element.querySelectorAll(".words");
      gsap.timeline({
        scrollTrigger: { trigger: element, toggleActions: "restart none none reset" }
      }).set(element, { autoAlpha: 1 })
        .from(lines, { duration: 1, yPercent: 100, ease: Power3.out, stagger: 0.25, delay: 0.2 });
    });
  };

  // Animate elements that are not inside #menu immediately
  const nonMenuText = Array.from(revealText).filter(el => !el.closest('#menu'));
  if (nonMenuText.length > 0) {
    animateText(nonMenuText);
  }

  const menu = document.getElementById('menu');
  const menuText = Array.from(revealText).filter(el => el.closest('#menu'));

  // Animate elements inside #menu when it becomes active
  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class' && menu.classList.contains('is-active')) {
        animateText(menuText);
      }
    });
  }).observe(menu, { attributes: true });
});