/**
 * views/customer/home.js
 * -----------------------------------------------------------------------
 * Vista principal pública. Hero + buscador + eventos destacados +
 * categorías + próximos eventos + newsletter (decorativo).
 * -----------------------------------------------------------------------
 */
import { getEvents, getCategories, CIUDADES } from "../../storage.js";
import { navigate } from "../../router.js";
import { showToast } from "../../app.js";

function formatDateLong(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

function withCategoryNames(events, categories) {
  const map = new Map(categories.map((c) => [c.id, c.name]));
  return events.map((e) => ({
    ...e,
    categoryName: map.get(e.categoryId) || "Evento",
  }));
}

export function renderHomeView() {
  const root = document.createElement("div");
  root.className = "view-home cc-anim-enter";

  const categories = getCategories();
  const events = withCategoryNames(getEvents(), categories);

  // Ordenamos por fecha ascendente para "destacados" y "próximos"
  const upcoming = [...events]
    .filter((e) => e.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const featured = upcoming.slice(0, 4);
  const nextEvents = upcoming.slice(0, 6);

  root.innerHTML = `
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__copy cc-anim-enter">
          <h1 class="t-display-lg">Vive los mejores eventos del país</h1>
          <p class="hero__subtitle t-body-lg">
            Conecta con conciertos, deportes y experiencias inolvidables. La plataforma de
            ticketing pensada para la velocidad y la emoción.
          </p>
          <div class="hero__actions">
            <button class="btn btn--primary" data-action="explore">Explorar eventos</button>
            <button class="btn btn--outline" data-action="see-featured">Ver destacados</button>
          </div>
        </div>
        <div class="hero__visual hide-mobile" aria-hidden="true">
          <div class="hero__visual-glow"></div>
          <div class="hero__visual-frame">
            ${
              featured[0]
                ? `<img src="${escapeAttr(featured[0].image || "")}" alt=""
                    onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22450%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23131b2e%22/></svg>'" />`
                : `<div class="hero__visual-placeholder"></div>`
            }
            <div class="hero__visual-overlay">
              <span class="chip chip--live"><span class="dot"></span></span>
              <span class="t-label-bold" style="color:#fff">En vivo ahora</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="search-bar-section">
      <div class="container">
        <form class="search-bar" data-role="search-form">
          <div class="search-bar__field">
            <span aria-hidden="true">🔍</span>
            <input type="text" name="q" placeholder="Buscar artista o evento" autocomplete="off" />
          </div>
          <div class="search-bar__field">
            <span aria-hidden="true">🏷️</span>
            <select name="categoria">
              <option value="">Categoría</option>
              ${categories.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("")}
            </select>
          </div>
          <div class="search-bar__field">
            <span aria-hidden="true">📍</span>
            <select name="ciudad">
              <option value="">Ciudad</option>
              ${CIUDADES.map((c) => `<option value="${c}">${c}</option>`).join("")}
            </select>
          </div>
          <button class="btn btn--primary search-bar__submit" type="submit">Buscar</button>
        </form>
      </div>
    </section>

    <section class="section" id="destacados">
      <div class="container">
        <div class="section-heading">
          <div>
            <h2 class="t-headline-md">Eventos destacados</h2>
            <p class="t-body-sm section-heading__sub">Las mejores experiencias elegidas para ti.</p>
          </div>
          <a href="#/eventos" class="section-heading__link">Ver todos →</a>
        </div>
        <div class="events-grid cc-stagger" data-role="featured-grid"></div>
      </div>
    </section>

    <section class="section section--tight categories-section">
      <div class="container">
        <h2 class="t-headline-md" style="margin-bottom:24px;">Categorías populares</h2>
        <div class="categories-bento" data-role="categories-bento"></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-heading">
          <h2 class="t-headline-md">Próximos eventos</h2>
        </div>
        <div class="upcoming-scroll no-scrollbar" data-role="upcoming-scroll"></div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="newsletter">
          <div class="newsletter__copy">
            <h2 class="t-headline-md" style="color:#fff;">No te pierdas de nada</h2>
            <p style="color:var(--color-on-primary-container);">
              Suscríbete para recibir preventas exclusivas y anuncios de nuevos eventos antes que nadie.
            </p>
          </div>
          <form class="newsletter__form" data-role="newsletter-form">
            <input type="email" placeholder="Tu correo electrónico" required />
            <button class="btn btn--primary" type="submit">Unirme</button>
          </form>
        </div>
      </div>
    </section>
  `;

  /* ---------------- Featured grid ---------------- */
  const featuredGrid = root.querySelector('[data-role="featured-grid"]');
  if (featured.length === 0) {
    featuredGrid.innerHTML = emptyStateMarkup(
      "🎫",
      "Todavía no hay eventos publicados",
      "Muy pronto encontrarás aquí los mejores conciertos y experiencias.",
    );
  } else {
    featured.forEach((evt) => {
      const card = document.createElement("cc-event-card");
      card.data = evt;
      featuredGrid.appendChild(card);
    });
  }

  /* ---------------- Categories bento ---------------- */
  const bento = root.querySelector('[data-role="categories-bento"]');
  if (categories.length === 0) {
    bento.innerHTML = emptyStateMarkup(
      "🗂️",
      "Aún no hay categorías",
      "Vuelve pronto para explorar por tipo de evento.",
    );
  } else {
    const palette = [
      "#131b2e",
      "#00687a",
      "#3f465c",
      "#006172",
      "#271901",
      "#574425",
    ];
    bento.innerHTML = categories
      .slice(0, 4)
      .map((cat, i) => {
        const count = events.filter((e) => e.categoryId === cat.id).length;
        return `
        <a href="#/eventos?categoria=${cat.id}" class="category-tile" style="background:${palette[i % palette.length]}">
          <h3>${escapeHtml(cat.name)}</h3>
          <p>${count} evento${count === 1 ? "" : "s"} disponible${count === 1 ? "" : "s"}</p>
        </a>`;
      })
      .join("");
  }

  /* ---------------- Upcoming horizontal scroll ---------------- */
  const upcomingScroll = root.querySelector('[data-role="upcoming-scroll"]');
  if (nextEvents.length === 0) {
    upcomingScroll.innerHTML = emptyStateMarkup(
      "📅",
      "No hay próximos eventos",
      "Cuando se publiquen eventos, aparecerán aquí.",
    );
  } else {
    upcomingScroll.innerHTML = nextEvents
      .map(
        (evt) => `
      <div class="upcoming-item" data-id="${evt.id}">
        <div class="upcoming-item__thumb">
          <img src="${escapeAttr(evt.image || "")}" alt=""
            onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e4e2e4%22/></svg>'" />
        </div>
        <div class="upcoming-item__info">
          <p class="t-label-bold" style="color:var(--color-secondary)">${formatDateLong(evt.date)}</p>
          <h4>${escapeHtml(evt.name)}</h4>
          <p class="t-body-sm">${escapeHtml(evt.city || "")}</p>
        </div>
        <div class="upcoming-item__price">
          <p>$${Math.round((evt.price || 0) / 1000)}k</p>
          <span>›</span>
        </div>
      </div>`,
      )
      .join("");
    upcomingScroll.querySelectorAll("[data-id]").forEach((el) => {
      el.addEventListener("click", () => navigate(`/evento/${el.dataset.id}`));
    });
  }

  /* ---------------- Handlers ---------------- */
  root
    .querySelector('[data-action="explore"]')
    .addEventListener("click", () => navigate("/eventos"));
  root
    .querySelector('[data-action="see-featured"]')
    .addEventListener("click", () => {
      root.querySelector("#destacados").scrollIntoView({ behavior: "smooth" });
    });

  root
    .querySelector('[data-role="search-form"]')
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const params = new URLSearchParams();
      if (fd.get("q")) params.set("q", fd.get("q"));
      if (fd.get("categoria")) params.set("categoria", fd.get("categoria"));
      if (fd.get("ciudad")) params.set("ciudad", fd.get("ciudad"));
      navigate(`/eventos?${params.toString()}`);
    });

  root
    .querySelector('[data-role="newsletter-form"]')
    .addEventListener("submit", (e) => {
      e.preventDefault();
      e.target.reset();
      showToast(
        "¡Gracias por unirte! Te avisaremos de nuevos eventos.",
        "success",
      );
    });

  return root;
}

function emptyStateMarkup(icon, title, text) {
  return `
    <div class="empty-state" style="grid-column:1/-1;">
      <div class="icon">${icon}</div>
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}
