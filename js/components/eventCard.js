/**
 * <cc-event-card>
 * -----------------------------------------------------------------------
 * Web Component que renderiza una tarjeta de evento reutilizable en Home
 * y en el catálogo de Eventos.
 *
 * Uso:
 *   const card = document.createElement('cc-event-card');
 *   card.data = eventObject;      // { id, name, price, date, time, city,
 *                                  //   image, categoryName, description }
 *   card.addEventListener('cc-add-to-cart', (e) => { ... e.detail.id });
 * -----------------------------------------------------------------------
 */

const MESES = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

function formatMoney(value) {
  const n = Number(value) || 0;
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
}

function formatDateBadge(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return `${MESES[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
}

class EventCard extends HTMLElement {
  constructor() {
    super();
    this._data = null;
  }

  set data(value) {
    this._data = value;
    this.render();
  }

  get data() {
    return this._data;
  }

  connectedCallback() {
    if (this._data) this.render();
  }

  render() {
    const evt = this._data;
    if (!evt) return;

    this.className = "event-card event-card-hover";
    this.innerHTML = `
      <div class="event-card__media" data-role="open-detail">
        <img
          src="${escapeAttr(evt.image || "")}"
          alt="${escapeAttr(evt.name)}"
          loading="lazy"
          onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22500%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e4e2e4%22/></svg>'"
        />
        <span class="event-card__date-badge">${formatDateBadge(evt.date)}</span>
      </div>
      <div class="event-card__body">
        <div class="event-card__tags">
          <span class="chip">${escapeHtml(evt.categoryName || "Evento")}</span>
        </div>
        <h3 class="event-card__title" data-role="open-detail">${escapeHtml(evt.name)}</h3>
        <p class="event-card__location">
          <span class="material-icon" aria-hidden="true">📍</span> ${escapeHtml(evt.city || "")}
        </p>
        <div class="event-card__footer">
          <div>
            <p class="event-card__from">Desde</p>
            <p class="event-card__price">${formatMoney(evt.price)}</p>
          </div>
          <button class="btn btn--dark btn--sm" data-role="add-to-cart" type="button">Comprar</button>
        </div>
      </div>
    `;

    this.querySelectorAll('[data-role="open-detail"]').forEach((el) => {
      el.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("cc-open-detail", {
            detail: { id: evt.id },
            bubbles: true,
          }),
        );
      });
    });

    this.querySelector('[data-role="add-to-cart"]').addEventListener(
      "click",
      (e) => {
        e.stopPropagation();
        this.dispatchEvent(
          new CustomEvent("cc-add-to-cart", {
            detail: { id: evt.id, name: evt.name },
            bubbles: true,
          }),
        );
      },
    );
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

customElements.define("cc-event-card", EventCard);
