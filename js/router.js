import { initializeSidebar } from "./handlers/adminHandlers.js";
import { categories } from "./views/admin/categories.js";
import { dashboard } from "./views/admin/dashboard.js";
import { events } from "./views/admin/events.js";
import { sales } from "./views/admin/sales.js";

const routes = {
    "#dashboard": dashboard,
    "#categories": categories,
    "#events": events,
    "#sales": sales
}

export function loadRoute() {
    const app = document.querySelector("#app");
    const currentRoute = window.location.hash || "#dashboard";

    const route = routes[currentRoute];
    app.innerHTML = route();

    initializeSidebar();
}