import "./components/modal.js";
import "./components/toast.js";
import "./components/creationMenu.js";
import "./components/loginModal.js";
import "./views/layouts/adminLayout.js";
import "./views/admin/dashboard.js";
import "./views/admin/categories.js";
import "./views/admin/events.js";
import "./views/admin/sales.js";
import { isAuthenticated } from "./auth.js";

const adminRoutes = {
    "#dashboard": "dashboard-view",
    "#categories": "categories-view",
    "#events": "events-view",
    "#sales": "sales-view"
};

export function loadRoute() {
    const app = document.querySelector("#app");
    const currentRoute = window.location.hash || "#login";

    if (currentRoute === "#login") {
        if (isAuthenticated()) {
            window.location.hash = "#dashboard";
            return;
        }

        app.innerHTML = "<login-modal></login-modal>";
        return;
    }

    if (!isAuthenticated()) {
        window.location.hash = "#login";
        return;
    }

    const tag = adminRoutes[currentRoute];

    if (!tag) {
        window.location.hash = "#dashboard";
        return;
    }

    app.innerHTML = `<admin-layout active-route="${currentRoute.replace("#", "")}"><${tag}></${tag}></admin-layout>`;
}
