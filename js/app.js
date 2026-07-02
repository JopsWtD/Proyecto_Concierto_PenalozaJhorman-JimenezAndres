/**
 * app.js
 * -----------------------------------------------------------------------
 * Punto de entrada del front de clientes de Conciertos Conectados.
 * Registra los Web Components, monta el navbar y el carrito, define las
 * rutas y arranca el router.
 * -----------------------------------------------------------------------
 */

// --- Componentes (se autoregistran vía customElements.define al importarse) ---
import "./components/modal.js";
import "./components/navbar.js";
import "./components/eventCard.js";
import "./components/cartModal.js";

// --- Router y vistas ---
import {
  registerRoute,
  registerNotFound,
  initRouter,
  navigate,
} from "./router.js";
import { renderHomeView } from "./views/customer/home.js";
import { renderEventsView } from "./views/customer/events.js";
import { renderEventDetailView } from "./views/customer/eventDetail.js";

/* =======================================================================
 * Sistema de notificaciones (toasts) — usado en toda la app para
 * confirmar acciones o mostrar errores, tal como pide el enunciado.
 * ===================================================================== */
let toastContainer = null;

export function showToast(message, type = "success", duration = 3500) {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "cc-toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `cc-toast cc-toast--${type}`;
  toast.innerHTML = `
    <span class="cc-toast__icon">${type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️"}</span>
    <span class="cc-toast__message"></span>
  `;
  toast.querySelector(".cc-toast__message").textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "cc-toast-out 0.25s ease forwards";
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

/* =======================================================================
 * Navbar + Carrito globales
 * ===================================================================== */
function mountShell() {
  const navbar = document.createElement("cc-navbar");
  document.body.prepend(navbar);

  const cartModal = document.createElement("cc-cart-modal");
  document.body.appendChild(cartModal);

  navbar.addEventListener("cc-open-cart", () => cartModal.open());

  // Cualquier tarjeta de evento en cualquier vista dispara 'cc-add-to-cart'
  // y 'cc-open-detail'; los escuchamos a nivel global (event bubbling).
  document.body.addEventListener("cc-add-to-cart", (e) => {
    import("./storage.js").then(({ addToCart, getEventById }) => {
      addToCart(e.detail.id, 1);
      const evt = getEventById(e.detail.id);
      showToast(
        `"${evt ? evt.name : "Evento"}" agregado al carrito.`,
        "success",
      );
    });
  });

  document.body.addEventListener("cc-open-detail", (e) => {
    navigate(`/evento/${e.detail.id}`);
  });
}

/* =======================================================================
 * Rutas
 * ===================================================================== */
function setupRoutes() {
  registerRoute("/", () => renderHomeView());
  registerRoute("/eventos", (params, query) => renderEventsView(query));
  registerRoute("/evento/:id", (params) => renderEventDetailView(params.id));

  registerRoute("/admin/login", () => {
    const el = document.createElement("div");
    el.className = "empty-state";
    el.innerHTML = `
      <div class="icon">🚧</div>
      <h3>Panel de administración en construcción</h3>
      <p>Estamos trabajando en esta sección. Vuelve pronto.</p>
      <a class="btn btn--dark" href="#/" style="margin-top:16px;display:inline-flex;">Volver al inicio</a>
    `;
    return el;
  });

  registerNotFound(() => {
    const el = document.createElement("div");
    el.className = "empty-state";
    el.innerHTML = `
      <div class="icon">🔎</div>
      <h3>Página no encontrada</h3>
      <a class="btn btn--dark" href="#/" style="margin-top:16px;display:inline-flex;">Volver al inicio</a>
    `;
    return el;
  });
}

/* =======================================================================
 * Bootstrap
 * ===================================================================== */
function bootstrap() {
  mountShell();
  setupRoutes();
  initRouter(document.getElementById("app-view"));
}

document.addEventListener("DOMContentLoaded", bootstrap);
