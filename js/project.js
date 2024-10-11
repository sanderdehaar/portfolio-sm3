// Change learning outcome text - mobile
function updateButtonText() {
    const buttons = document.querySelectorAll('.learning-outcome');
    if (window.innerWidth < 920) {
        buttons.forEach(button => {
            button.innerText = button.getAttribute('data-text');
        });
    } else {
        buttons.forEach((button, index) => {
            button.innerText = `learning outcome ${button.getAttribute('data-text')}`;
        });
    }
}

window.addEventListener('load', updateButtonText);
window.addEventListener('resize', updateButtonText);

// Retrieve project data
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Scroll back to top on page load
        window.scrollTo(0, 0);

        // Function to get URL parameters
        const getUrlParam = (param) => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        };
        const projectNameFromUrl = getUrlParam('name');

        // Fetch the project data
        const response = await fetch('data.json');
        const data = await response.json();
        const project = data.projects.find(p => p.name === projectNameFromUrl);

        // Check if the project exists, otherwise redirect
        if (!project) {
            window.location.href = 'index.html';
            return;
        }

        // Update the page title
        document.title = `Portfolio - ${project.title}`;

        // Update banner section
        const bannerSection = document.querySelector('#hero-project-banner');
        bannerSection.querySelector('.background-image').src = project.banner.backgroundImage;
        bannerSection.querySelector('.image').src = project.banner.bannerImage;
        bannerSection.querySelector('h3').textContent = project.banner.heading;

        // Update banner background color
        const rgbaColor = hexToRgba(project.banner.color, 0.9);
        bannerSection.querySelector('.background-overlay').style.backgroundColor = rgbaColor;

        // Update project information section
        const infoSection = document.querySelector('#hero-project-information');
        infoSection.querySelector('.title h1').textContent = project.title;
        infoSection.querySelector('.title p').textContent = project.information.description;
        infoSection.querySelector('img').src = project.information.mockupImage;
        infoSection.querySelector('.full-desc').textContent = project.information.fullDescription;

        // Update outcomes section
        const outcomesContainer = document.querySelector('#all-outcomes');
        Object.keys(project.outcomes).forEach((outcomeKey, index) => {
            const outcomes = project.outcomes[outcomeKey];
            const activeClass = index === 0 ? 'is-active' : '';
            const outcomesHTML = `
                <div class="outcomes-container ${activeClass}" id="learning-outcome-${outcomeKey}">
                    ${outcomes.map(outcome => `
                        <div class="outcomes">
                            <div class="carousel">
                                <div class="buttons">
                                    <button class="prev-btn"><i class="fa-solid fa-arrow-right"></i></button>
                                    <button class="next-btn"><i class="fa-solid fa-arrow-right"></i></button>
                                </div>
                                <p class="carousel-index">1/${outcome.images.length}</p>
                                <div class="full-screen" id="${outcome.id}">
                                    <p>full screen</p>
                                    <i class="fa-solid fa-expand"></i>
                                </div>
                                ${outcome.images.map((image, imgIndex) => `
                                    <img src="${image}" alt="${outcome.title} image" class="${imgIndex === 0 ? 'is-active' : ''}" />
                                `).join('')}
                            </div>
                            <div class="information">
                                <h3>${outcome.title}</h3>
                                <p>${outcome.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>`;
            outcomesContainer.insertAdjacentHTML('beforeend', outcomesHTML);
        });

        // Initialize carousel functionality
        imageCarousel();

        // Update social icons
        const extraInfoContainer = document.querySelector('#extra-information');
        project.extraInformation.socials.forEach(social => {
            const socialHTML = `
                <a href="${social.link}" target="_blank">
                    <button>
                        <p>${social.text}</p>
                        <i class="${social.icon}"></i>
                    </button>
                </a>`;
            extraInfoContainer.insertAdjacentHTML('beforeend', socialHTML);
        });

        // Set up event listeners for outcome buttons (if any)
        changeOutcomes();

        // Initialize full screen carousel
        callFullScreenCarousel(project);

        const loader = document.querySelector('#loader');
        loader.classList.remove('is-active');

    } catch (error) {
        console.error('Error fetching data.json:', error);
    }
});

// Initialize carousel functionality
function imageCarousel() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('img');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const indexDisplay = carousel.querySelector('.carousel-index');
        let currentIndex = 0;

        const updateIndexDisplay = () => {
            indexDisplay.textContent = `images ${currentIndex + 1}/${images.length}`;
        };

        const showImage = () => {
            images.forEach((img, idx) => {
                img.classList.toggle('is-active', idx === currentIndex);
            });
            updateIndexDisplay();
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage();
        });

        showImage();
    });
}

// Function to set up event listeners for outcome buttons
function changeOutcomes() {
    const buttons = document.querySelectorAll('.learning-outcome');
    const outcomes = document.querySelectorAll('#all-outcomes .outcomes-container');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('is-active'));
            outcomes.forEach(outcome => outcome.classList.remove('is-active'));

            const outcomeId = `learning-outcome-${button.getAttribute('data-text')}`;
            const activeOutcome = document.getElementById(outcomeId);
            if (activeOutcome) {
                activeOutcome.classList.add('is-active');
                button.classList.add('is-active');
            } else {
                console.warn(`No active outcome found for ID: ${outcomeId}`);
            }
        });
    });
}

// Function to convert hex color to RGBA
function hexToRgba(hex, opacity) {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}


function callFullScreenCarousel(project) {
    const iconsFullScreen = document.querySelectorAll('.full-screen');
    const viewCarousel = document.querySelector('#carousel-view');

    function fullScreenCarousel() {
        const activeOutcome = document.querySelector('.outcomes-container.is-active');

        // Reset carousel content
        viewCarousel.innerHTML = `
            <div class="top">
                <p class="carousel-index"></p>
                <div class="close" id="close-carousel"> 
                    <span>close</span>
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
            <div class="buttons">
                <button class="prev-btn"><i class="fa-solid fa-arrow-left"></i></button>
                <button class="next-btn"><i class="fa-solid fa-arrow-right"></i></button>
            </div>
        `;

        if (activeOutcome) {
            const outcomeId = activeOutcome.id.split('-').pop();
            const outcomeData = project.outcomes[outcomeId];

            if (outcomeData) {
                // Find the specific element within the outcome data that matches this.id
                const specificOutcomeData = outcomeData.find(item => item.id === this.id);

                if (specificOutcomeData) {
                    const outcomeImages = specificOutcomeData.images;
                    let currentIndex = 0;

                    function updateCarousel() {
                        // Clear existing images
                        const imgElement = document.createElement('img');
                        imgElement.src = outcomeImages[currentIndex];
                        imgElement.classList.add('is-active');

                        // Clear and append the new image
                        viewCarousel.querySelectorAll('img').forEach(img => img.remove());
                        viewCarousel.appendChild(imgElement);

                        // Update index display
                        const indexDisplay = viewCarousel.querySelector('.carousel-index');
                        indexDisplay.textContent = `images ${currentIndex + 1}/${outcomeImages.length}`;
                    }

                    updateCarousel(); // Initial update of the carousel

                    // Next button event
                    viewCarousel.querySelector('.next-btn').addEventListener('click', () => {
                        currentIndex = (currentIndex + 1) % outcomeImages.length;
                        updateCarousel();
                    });

                    // Previous button event
                    viewCarousel.querySelector('.prev-btn').addEventListener('click', () => {
                        currentIndex = (currentIndex - 1 + outcomeImages.length) % outcomeImages.length;
                        updateCarousel();
                    });

                    // Close button event
                    viewCarousel.querySelector('#close-carousel').addEventListener('click', () => {
                        viewCarousel.classList.toggle('is-active');
                        document.body.classList.toggle('disable-scroll');
                    });
                } else {
                    console.warn(`No specific outcome data found for ID: ${this.id}`);
                }
            } else {
                console.warn(`No outcome data found for outcome ID: ${outcomeId}`);
            }
        } else {
            console.log('No active learning outcome found.');
        }

        // Toggle full screen mode
        document.body.classList.toggle('disable-scroll');
        viewCarousel.classList.toggle("is-active");
    }

    // Attach event listeners to each full-screen icon
    iconsFullScreen.forEach(icon => {
        icon.addEventListener('click', fullScreenCarousel);
    });
}