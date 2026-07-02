/**
 * views/customer/events.js
 * -----------------------------------------------------------------------
 * Catálogo público de eventos: buscador por nombre en tiempo real +
 * filtro por ciudad + filtro por categoría.
 * -----------------------------------------------------------------------
 */
import { searchEvents, getCategories, CIUDADES } from "../../storage.js";
import { navigate } from "../../router.js";

function withCategoryNames(events, categories) {
  const map = new Map(categories.map((c) => [c.id, c.name]));
  return events.map((e) => ({
    ...e,
    categoryName: map.get(e.categoryId) || "Evento",
  }));
}

export function renderEventsView(query) {
  const root = document.createElement("div");
  root.className = "view-events cc-anim-enter";

  const categories = getCategories();
  const initial = {
    q: query.get("q") || query.get("query") || "",
    categoria: query.get("categoria") || "",
    ciudad: query.get("ciudad") || "",
  };

  root.innerHTML = `
    <section class="section section--tight">
      <div class="container">
        <h1 class="t-headline-md" style="margin-bottom:8px;">Todos los eventos</h1>
        <p class="t-body-sm" style="color:var(--color-on-surface-variant);margin-bottom:24px;">
          Encuentra el evento perfecto para ti.
        </p>

        <div class="filters-bar">
          <div class="filters-bar__search">
            <span aria-hidden="true">🔍</span>
            <input type="text" data-role="q" placeholder="Buscar por nombre del evento" value="${escapeAttr(initial.q)}" autocomplete="off" />
          </div>
          <select data-role="categoria">
            <option value="">Todas las categorías</option>
            ${categories
              .map(
                (c) =>
                  `<option value="${c.id}" ${c.id === initial.categoria ? "selected" : ""}>${escapeHtml(c.name)}</option>`,
              )
              .join("")}
          </select>
          <select data-role="ciudad">
            <option value="">Todas las ciudades</option>
            ${CIUDADES.map((c) => `<option value="${c}" ${c === initial.ciudad ? "selected" : ""}>${c}</option>`).join("")}
          </select>
          <button class="btn btn--ghost" type="button" data-role="clear">Limpiar</button>
        </div>

        <p class="filters-bar__count" data-role="count"></p>

        <div class="events-grid cc-stagger" data-role="grid"></div>
      </div>
    </section>
  `;

  const grid = root.querySelector('[data-role="grid"]');
  const countLabel = root.querySelector('[data-role="count"]');
  const qInput = root.querySelector('[data-role="q"]');
  const catSelect = root.querySelector('[data-role="categoria"]');
  const citySelect = root.querySelector('[data-role="ciudad"]');

  let debounceTimer = null;

  function currentFilters() {
    return {
      query: qInput.value,
      categoryId: catSelect.value,
      city: citySelect.value,
    };
  }

  function renderResults() {
    const filters = currentFilters();
    const results = withCategoryNames(searchEvents(filters), categories);

    countLabel.textContent =
      results.length === 0
        ? ""
        : `${results.length} evento${results.length === 1 ? "" : "s"} encontrado${results.length === 1 ? "" : "s"}`;

    if (results.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="icon">🔎</div>
          <h3>No encontramos eventos con esos filtros</h3>
          <p>Intenta con otra palabra clave o quita algún filtro.</p>
          <button class="btn btn--dark" data-role="clear-inline" style="margin-top:12px;">Limpiar filtros</button>
        </div>
      `;
      grid
        .querySelector('[data-role="clear-inline"]')
        .addEventListener("click", clearFilters);
      return;
    }

    grid.innerHTML = "";
    results.forEach((evt) => {
      const card = document.createElement("cc-event-card");
      card.data = evt;
      grid.appendChild(card);
    });
  }

  function syncUrl() {
    const filters = currentFilters();
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.categoryId) params.set("categoria", filters.categoryId);
    if (filters.city) params.set("ciudad", filters.city);
    const qs = params.toString();
    history.replaceState(null, "", `#/eventos${qs ? `?${qs}` : ""}`);
  }

  function clearFilters() {
    qInput.value = "";
    catSelect.value = "";
    citySelect.value = "";
    syncUrl();
    renderResults();
  }

  qInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      syncUrl();
      renderResults();
    }, 200); // búsqueda "en tiempo real" con un pequeño debounce
  });
  catSelect.addEventListener("change", () => {
    syncUrl();
    renderResults();
  });
  citySelect.addEventListener("change", () => {
    syncUrl();
    renderResults();
  });
  root
    .querySelector('[data-role="clear"]')
    .addEventListener("click", clearFilters);

  renderResults();

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
