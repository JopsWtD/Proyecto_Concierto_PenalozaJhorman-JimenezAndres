/**
 * <cc-navbar>
 * -----------------------------------------------------------------------
 * Barra de navegación pública (front de clientes). Incluye logo, enlaces
 * a Home/Eventos, ícono de carrito con contador reactivo y acceso al
 * login de administrador.
 * -----------------------------------------------------------------------
 */
import { getCartCount } from "../storage.js";

class CCNavbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this._onCartUpdated = () => this.updateCartBadge();
    window.addEventListener("cart:updated", this._onCartUpdated);
    window.addEventListener("hashchange", () => this.updateActiveLink());
    this.updateActiveLink();
  }

  disconnectedCallback() {
    window.removeEventListener("cart:updated", this._onCartUpdated);
  }

  render() {
    this.innerHTML = `
      <nav class="cc-navbar">
        <div class="cc-navbar__inner container">
          <a class="cc-navbar__brand" href="#/">Conciertos Conectados</a>

          <button class="cc-navbar__burger hide-desktop" data-role="burger" aria-label="Abrir menú" type="button">
            <span></span><span></span><span></span>
          </button>

          <div class="cc-navbar__links" data-role="links">
            <a href="#/" data-path="/">Inicio</a>
            <a href="#/eventos" data-path="/eventos">Eventos</a>
          </div>

          <div class="cc-navbar__actions">
            <button class="cc-navbar__cart" data-role="cart-btn" type="button" aria-label="Ver carrito">
              🛒
              <span class="cc-navbar__cart-badge" data-role="cart-count" hidden>0</span>
            </button>
            <a class="btn btn--dark btn--sm" href="#/admin/login">Ingresar</a>
          </div>
        </div>
      </nav>
    `;

    this.querySelector('[data-role="cart-btn"]').addEventListener(
      "click",
      () => {
        this.dispatchEvent(new CustomEvent("cc-open-cart", { bubbles: true }));
      },
    );

    this.querySelector('[data-role="burger"]').addEventListener("click", () => {
      this.querySelector('[data-role="links"]').classList.toggle("is-open");
    });

    this.updateCartBadge();
  }

  updateCartBadge() {
    const badge = this.querySelector('[data-role="cart-count"]');
    if (!badge) return;
    const count = getCartCount();
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }

  updateActiveLink() {
    const current = (window.location.hash.slice(1) || "/").split("?")[0];
    this.querySelectorAll("[data-path]").forEach((a) => {
      a.classList.toggle("is-active", a.dataset.path === current);
    });
  }
}

customElements.define("cc-navbar", CCNavbar);
