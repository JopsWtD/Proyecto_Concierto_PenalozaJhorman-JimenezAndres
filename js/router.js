/**
 * router.js
 * -----------------------------------------------------------------------
 * Router SPA minimalista basado en el hash de la URL (#/ruta).
 * No depende de ninguna librería: escucha 'hashchange' y 'load', resuelve
 * la ruta contra las registradas (con soporte de parámetros :id) y monta
 * el Custom Element correspondiente dentro del contenedor #app-view.
 * -----------------------------------------------------------------------
 */

const routes = [];
let outlet = null;
let notFoundHandler = null;

/**
 * Registra una ruta.
 * @param {string} pattern   Ej: '/', '/eventos', '/evento/:id'
 * @param {(params: Record<string,string>, query: URLSearchParams) => HTMLElement} render
 */
export function registerRoute(pattern, render) {
  const paramNames = [];
  const regexStr = pattern
    .replace(/\/+$/, "")
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) {
        paramNames.push(segment.slice(1));
        return "([^/]+)";
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");

  routes.push({
    regex: new RegExp(`^${regexStr || "/"}$`),
    paramNames,
    render,
  });
}

export function registerNotFound(render) {
  notFoundHandler = render;
}

export function initRouter(outletElement) {
  outlet = outletElement;
  window.addEventListener("hashchange", resolveRoute);
  window.addEventListener("load", resolveRoute);
  // Si el script se ejecuta después de 'load', resolvemos ya mismo.
  if (document.readyState === "complete") resolveRoute();
}

export function navigate(path) {
  window.location.hash = path.startsWith("#") ? path : `#${path}`;
}

function parseHash() {
  const raw = window.location.hash.slice(1) || "/";
  const [path, queryString = ""] = raw.split("?");
  const cleanPath = path.replace(/\/+$/, "") || "/";
  return { path: cleanPath, query: new URLSearchParams(queryString) };
}

function resolveRoute() {
  if (!outlet) return;
  const { path, query } = parseHash();

  for (const route of routes) {
    const match = path.match(route.regex);
    if (match) {
      const params = {};
      route.paramNames.forEach(
        (name, i) => (params[name] = decodeURIComponent(match[i + 1])),
      );
      renderInto(route.render(params, query));
      window.scrollTo(0, 0);
      return;
    }
  }

  if (notFoundHandler) {
    renderInto(notFoundHandler());
  } else {
    outlet.innerHTML =
      '<div class="empty-state"><h3>Página no encontrada</h3></div>';
  }
}

function renderInto(node) {
  outlet.innerHTML = "";
  if (node) outlet.appendChild(node);
}
