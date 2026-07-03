import { dashboard } from "./views/admin/dashboard.js";
import { events } from "./views/admin/events.js";
import { categories } from "./views/admin/categories.js";
import { sales } from "./views/admin/sales.js";

document.querySelector("#app").innerHTML = `${sales()}`;