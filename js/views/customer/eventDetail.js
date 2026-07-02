/**
 * views/customer/eventDetail.js
 * -----------------------------------------------------------------------
 * Vista de detalle de un evento: imagen ampliada, nombre, descripción,
 * fecha, hora, precio, botón volver y botón agregar al carrito.
 * -----------------------------------------------------------------------
 */
import { getEventById, getCategoryById, addToCart } from "../../storage.js";
import { navigate } from "../../router.js";
import { showToast } from "../../app.js";

function formatDate(dateStr) {
  if (!dateStr) return "Fecha por confirmar";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(timeStr) {
  if (!timeStr) return "Hora por confirmar";
  const [h, m] = timeStr.split(":");
  const hour = Number(h);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = ((hour + 11) % 12) + 1;
  return `${hour12}:${m || "00"} ${period}`;
}

export function renderEventDetailView(id) {
  const root = document.createElement("div");
  root.className = "view-event-detail cc-anim-enter";

  const event = getEventById(id);

  if (!event) {
    root.innerHTML = `
      <div class="section container">
        <div class="empty-state">
          <div class="icon">🎫</div>
          <h3>Evento no encontrado</h3>
          <p>Es posible que este evento ya no esté disponible.</p>
          <a href="#/eventos" class="btn btn--dark" style="margin-top:16px;display:inline-flex;">Ver todos los eventos</a>
        </div>
      </div>
    `;
    return root;
  }

  const category = event.categoryId ? getCategoryById(event.categoryId) : null;

  root.innerHTML = `
    <section class="section section--tight">
      <div class="container event-detail">
        <button class="event-detail__back" data-action="back" type="button">← Volver a eventos</button>

        <div class="event-detail__grid">
          <div class="event-detail__media">
            <img src="${escapeAttr(event.image || "")}" alt="${escapeAttr(event.name)}"
              onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22600%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e4e2e4%22/></svg>'" />
          </div>
          <div class="event-detail__info">
            ${category ? `<span class="chip">${escapeHtml(category.name)}</span>` : ""}
            <h1 class="t-headline-md event-detail__title">${escapeHtml(event.name)}</h1>

            <div class="event-detail__meta">
              <div class="event-detail__meta-item">
                <span aria-hidden="true">📅</span>
                <span>${formatDate(event.date)}</span>
              </div>
              <div class="event-detail__meta-item">
                <span aria-hidden="true">🕒</span>
                <span>${formatTime(event.time)}</span>
              </div>
              <div class="event-detail__meta-item">
                <span aria-hidden="true">📍</span>
                <span>${escapeHtml(event.city || "Ciudad por confirmar")}</span>
              </div>
            </div>

            <p class="event-detail__description">${escapeHtml(event.description || "Sin descripción disponible.")}</p>

            <div class="event-detail__buy">
              <div>
                <p class="t-label-bold" style="color:var(--color-on-surface-variant)">Precio</p>
                <p class="event-detail__price">$${Number(event.price || 0).toLocaleString("es-CO")}</p>
              </div>
              <button class="btn btn--primary" data-action="add-to-cart" type="button">Agregar al carrito</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  root.querySelector('[data-action="back"]').addEventListener("click", () => {
    if (window.history.length > 1) window.history.back();
    else navigate("/eventos");
  });

  root
    .querySelector('[data-action="add-to-cart"]')
    .addEventListener("click", () => {
      addToCart(event.id, 1);
      showToast(`"${event.name}" agregado al carrito.`, "success");
    });

  return root;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}
