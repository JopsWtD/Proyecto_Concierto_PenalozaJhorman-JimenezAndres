

export function initializeSidebar() {
    const buttons = document.querySelectorAll("[data-route]");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            window.location.hash = button.dataset.route;
        })
    })
};