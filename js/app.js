import { dashboard } from "./views/admin/dashboard.js";

console.log("Hola");

document.querySelector("#app").innerHTML = `${dashboard()}`;