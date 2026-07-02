/**
 * <cc-cart-modal>
 * -----------------------------------------------------------------------
 * Modal del carrito de compras. Tiene dos "pantallas" internas:
 *   1. Resumen del carrito (items + total + botón "Comprar")
 *   2. Formulario de datos del comprador (checkout)
 * Al confirmar la compra, registra la venta en storage.js y muestra
 * un mensaje de confirmación con el número de boleta asignado.
 *
 * Este archivo no estaba en el árbol de carpetas original del proyecto;
 * se agregó porque el carrito necesitaba su propia lógica (más allá de
 * lo que <cc-modal> ofrece de forma genérica).
 * -----------------------------------------------------------------------
 */
import {
  getCartDetailed,
  getCartTotal,
  removeFromCart,
  updateCartQuantity,
  createSale,
} from "../storage.js";
import { showToast } from "../app.js";

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString("es-CO")}`;
}

class CCCartModal extends HTMLElement {
  constructor() {
    super();
    this._modal = null;
    this._step = "cart"; // 'cart' | 'checkout' | 'confirmation'
    this._lastSale = null;
  }

  connectedCallback() {
    this._modal = document.createElement("cc-modal");
    this._modal.setAttribute("size", "md");
    this.appendChild(this._modal);
    this._modal.addEventListener("cc-modal-close", () => {
      // Si cerraron el modal tras confirmar la compra, reseteamos el paso.
      if (this._step === "confirmation") this._step = "cart";
    });
    this.renderStep();
  }

  open() {
    this._step = "cart";
    this.renderStep();
    this._modal.open();
  }

  renderStep() {
    if (this._step === "cart") return this.renderCartStep();
    if (this._step === "checkout") return this.renderCheckoutStep();
    if (this._step === "confirmation") return this.renderConfirmationStep();
  }

  /* ------------------------------------------------------------------ */
  renderCartStep() {
    const items = getCartDetailed();
    this._modal.setTitle("Tu carrito");

    const wrapper = document.createElement("div");
    wrapper.className = "cart-modal";

    if (items.length === 0) {
      wrapper.innerHTML = `
        <div class="empty-state">
          <div class="icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Explora los eventos disponibles y agrega entradas para continuar.</p>
        </div>
      `;
      this._modal.setBody(wrapper);
      return;
    }

    wrapper.innerHTML = `
      <ul class="cart-modal__list">
        ${items
          .map(
            (item) => `
          <li class="cart-modal__item" data-id="${item.eventId}">
            <img src="${escapeAttr(item.event.image || "")}" alt="${escapeAttr(item.event.name)}"
              onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e4e2e4%22/></svg>'" />
            <div class="cart-modal__item-info">
              <p class="cart-modal__item-name">${escapeHtml(item.event.name)}</p>
              <p class="cart-modal__item-price">${formatMoney(item.event.price)} c/u</p>
              <div class="cart-modal__qty">
                <button type="button" data-action="dec" aria-label="Restar">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-action="inc" aria-label="Sumar">+</button>
              </div>
            </div>
            <div class="cart-modal__item-right">
              <p class="cart-modal__item-subtotal">${formatMoney(item.subtotal)}</p>
              <button type="button" class="cart-modal__remove" data-action="remove" aria-label="Quitar">Quitar</button>
            </div>
          </li>
        `,
          )
          .join("")}
      </ul>
      <div class="cart-modal__total">
        <span>Total</span>
        <strong>${formatMoney(getCartTotal())}</strong>
      </div>
      <button class="btn btn--primary btn--full" data-action="checkout" type="button">Comprar</button>
    `;

    wrapper.querySelectorAll('[data-action="inc"]').forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("[data-id]").dataset.id;
        const item = items.find((i) => i.eventId === id);
        updateCartQuantity(id, item.quantity + 1);
        this.renderCartStep();
      }),
    );
    wrapper.querySelectorAll('[data-action="dec"]').forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("[data-id]").dataset.id;
        const item = items.find((i) => i.eventId === id);
        updateCartQuantity(id, item.quantity - 1);
        this.renderCartStep();
      }),
    );
    wrapper.querySelectorAll('[data-action="remove"]').forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("[data-id]").dataset.id;
        removeFromCart(id);
        showToast("Evento eliminado del carrito", "success");
        this.renderCartStep();
      }),
    );
    wrapper
      .querySelector('[data-action="checkout"]')
      .addEventListener("click", () => {
        this._step = "checkout";
        this.renderStep();
      });

    this._modal.setBody(wrapper);
  }

  /* ------------------------------------------------------------------ */
  renderCheckoutStep() {
    this._modal.setTitle("Datos de la compra");

    const wrapper = document.createElement("div");
    wrapper.className = "checkout-form";
    wrapper.innerHTML = `
      <p class="checkout-form__total">Total a pagar: <strong>${formatMoney(getCartTotal())}</strong></p>
      <form data-role="form" novalidate>
        <div class="field">
          <label for="cf-id">Número de identificación</label>
          <input id="cf-id" name="identification" type="text" required />
          <small class="error" hidden></small>
        </div>
        <div class="field">
          <label for="cf-name">Nombre completo</label>
          <input id="cf-name" name="name" type="text" required />
          <small class="error" hidden></small>
        </div>
        <div class="field">
          <label for="cf-address">Dirección</label>
          <input id="cf-address" name="address" type="text" required />
          <small class="error" hidden></small>
        </div>
        <div class="field">
          <label for="cf-phone">Teléfono</label>
          <input id="cf-phone" name="phone" type="tel" required />
          <small class="error" hidden></small>
        </div>
        <div class="field">
          <label for="cf-email">E-mail</label>
          <input id="cf-email" name="email" type="email" required />
          <small class="error" hidden></small>
        </div>
        <div class="checkout-form__actions">
          <button type="button" class="btn btn--ghost" data-action="back">Volver</button>
          <button type="submit" class="btn btn--primary">Confirmar compra</button>
        </div>
      </form>
    `;

    wrapper
      .querySelector('[data-action="back"]')
      .addEventListener("click", () => {
        this._step = "cart";
        this.renderStep();
      });

    wrapper
      .querySelector('[data-role="form"]')
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCheckoutSubmit(e.target);
      });

    this._modal.setBody(wrapper);
    wrapper.querySelector("#cf-id").focus();
  }

  handleCheckoutSubmit(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    let valid = true;

    Object.entries(data).forEach(([key, value]) => {
      const field = form.querySelector(`[name="${key}"]`).closest(".field");
      const errorEl = field.querySelector(".error");
      if (!value.trim()) {
        field.classList.add("has-error");
        errorEl.textContent = "Este campo es obligatorio.";
        errorEl.hidden = false;
        valid = false;
      } else if (key === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
        field.classList.add("has-error");
        errorEl.textContent = "Ingresa un correo válido.";
        errorEl.hidden = false;
        valid = false;
      } else {
        field.classList.remove("has-error");
        errorEl.hidden = true;
      }
    });

    if (!valid) {
      showToast("Revisa los campos marcados en rojo.", "error");
      return;
    }

    try {
      const sale = createSale(data);
      this._lastSale = sale;
      this._step = "confirmation";
      this.renderStep();
      showToast("¡Compra realizada con éxito!", "success");
    } catch (err) {
      showToast(err.message || "No se pudo procesar la compra.", "error");
    }
  }

  /* ------------------------------------------------------------------ */
  renderConfirmationStep() {
    this._modal.setTitle("¡Compra realizada!");
    const sale = this._lastSale;

    const wrapper = document.createElement("div");
    wrapper.className = "confirmation-step";
    wrapper.innerHTML = `
      <div class="confirmation-step__icon">🎟️</div>
      <h3>¡Compra realizada!</h3>
      <p>Tu boleta ha sido asignada correctamente.</p>
      <p class="confirmation-step__code">N.º de pedido: <strong>${sale ? sale.id : ""}</strong></p>
      <p class="confirmation-step__hint">Te enviamos el detalle a ${sale ? escapeHtml(sale.customer.email) : ""}.</p>
      <button class="btn btn--primary btn--full" data-action="close">Listo</button>
    `;

    wrapper
      .querySelector('[data-action="close"]')
      .addEventListener("click", () => {
        this._modal.close();
      });

    this._modal.setBody(wrapper);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

customElements.define("cc-cart-modal", CCCartModal);
