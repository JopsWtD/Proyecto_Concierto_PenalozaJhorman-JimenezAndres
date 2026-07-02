/**
 * <cc-modal>
 * -----------------------------------------------------------------------
 * Modal genérico y reutilizable (backdrop + panel + botón cerrar).
 * Cualquier otro componente (carrito, login, formularios admin) lo usa
 * como contenedor, inyectando su propio contenido dentro.
 *
 * Uso:
 *   const modal = document.createElement('cc-modal');
 *   modal.setAttribute('title', 'Mi carrito');
 *   modal.innerHTML = '<p>contenido...</p>';   // va al slot por defecto
 *   document.body.appendChild(modal);
 *   modal.open();
 *
 *   modal.addEventListener('cc-modal-close', () => modal.remove());
 * -----------------------------------------------------------------------
 */

class CCModal extends HTMLElement {
  constructor() {
    super();
    this._content = null;
  }

  connectedCallback() {
    // Guardamos el contenido original (luz/light DOM) puesto por quien
    // instancia el modal, antes de reemplazar el innerHTML.
    if (!this._content) {
      this._content = document.createElement("div");
      this._content.className = "cc-modal__original-content";
      while (this.firstChild) this._content.appendChild(this.firstChild);
    }

    const title = this.getAttribute("title") || "";
    const size = this.getAttribute("size") || "md"; // sm | md | lg

    this.innerHTML = `
      <div class="cc-modal__backdrop" data-role="backdrop"></div>
      <div class="cc-modal__panel cc-modal__panel--${size}" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="cc-modal__header">
          <h3 class="cc-modal__title">${title}</h3>
          <button class="cc-modal__close" data-role="close" type="button" aria-label="Cerrar">✕</button>
        </div>
        <div class="cc-modal__body" data-role="body"></div>
      </div>
    `;

    this.querySelector('[data-role="body"]').appendChild(this._content);
    this.querySelector('[data-role="backdrop"]').addEventListener("click", () =>
      this.close(),
    );
    this.querySelector('[data-role="close"]').addEventListener("click", () =>
      this.close(),
    );
    this._escHandler = (e) => {
      if (e.key === "Escape") this.close();
    };
  }

  open() {
    this.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this._escHandler);
  }

  close() {
    this.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this._escHandler);
    this.dispatchEvent(new CustomEvent("cc-modal-close", { bubbles: true }));
  }

  /** Reemplaza el contenido del cuerpo del modal en caliente. */
  setBody(node) {
    const body = this.querySelector('[data-role="body"]');
    body.innerHTML = "";
    body.appendChild(node);
  }

  setTitle(text) {
    const el = this.querySelector(".cc-modal__title");
    if (el) el.textContent = text;
  }
}

customElements.define("cc-modal", CCModal);
