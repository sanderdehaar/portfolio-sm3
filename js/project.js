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
                            <img src="${outcome.image}" alt="${outcome.title} image" />
                            <div class="information">
                                <h3>${outcome.title}</h3>
                                <p>${outcome.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>`;
            outcomesContainer.insertAdjacentHTML('beforeend', outcomesHTML);
        });

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

        // Set up event listeners for outcome buttons
        changeOutcomes();

    } catch (error) {
        console.error('Error fetching data.json:', error);
    }
});

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