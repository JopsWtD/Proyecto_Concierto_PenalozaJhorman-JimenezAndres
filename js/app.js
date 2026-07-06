import { initializeSidebar } from "./handlers/adminHandlers.js";
import { loadRoute } from "./router.js";

window.addEventListener("hashchange", loadRoute)

window.addEventListener("DOMContentLoaded", loadRoute)