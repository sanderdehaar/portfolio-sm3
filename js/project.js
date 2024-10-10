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

window.onload = updateButtonText;
window.onresize = updateButtonText;

// Learning outcomes change
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.learning-outcome');
    const outcomes = document.querySelectorAll('.outcomes-container');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('is-active'));
            outcomes.forEach(outcome => outcome.classList.remove('is-active'));

            button.classList.add('is-active');

            const outcomeId = `learning-outcome-${button.getAttribute('data-text')}`;
            document.getElementById(outcomeId).classList.add('is-active');
        });
    });
});