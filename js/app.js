import { loadRoute } from "./router.js";
import { seedData } from "./data-seed.js";

seedData();

window.addEventListener("hashchange", loadRoute);
window.addEventListener("DOMContentLoaded", loadRoute);
