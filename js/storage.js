/**
 * storage.js
 * -----------------------------------------------------------------------
 * Capa única de acceso a localStorage para Conciertos Conectados.
 * Todo el resto de la app (vistas, componentes) debe leer/escribir datos
 * ÚNICAMENTE a través de este módulo, nunca llamando a localStorage
 * directamente. Así, si el día de mañana se cambia el mecanismo de
 * persistencia, solo hay que tocar este archivo.
 * -----------------------------------------------------------------------
 */

const KEYS = {
  CATEGORIES: "cc_categories",
  EVENTS: "cc_events",
  SALES: "cc_sales",
  CART: "cc_cart",
  ADMIN_SESSION: "cc_admin_session",
};

/** Ciudades soportadas por la plataforma (fijas, según el enunciado). */
export const CIUDADES = ["Barranquilla", "Bogotá", "Bucaramanga", "Medellín"];

/* ---------------------------------------------------------------------
 * Helpers internos
 * ------------------------------------------------------------------- */
function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`[storage] Error leyendo "${key}":`, err);
    return [];
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[storage] Error guardando "${key}":`, err);
    return false;
  }
}

function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/* ---------------------------------------------------------------------
 * Categorías
 * ------------------------------------------------------------------- */
export function getCategories() {
  return read(KEYS.CATEGORIES);
}

export function getCategoryById(id) {
  return getCategories().find((c) => c.id === id) || null;
}

export function saveCategory(category) {
  const categories = getCategories();
  if (category.id) {
    const idx = categories.findIndex((c) => c.id === category.id);
    if (idx !== -1) categories[idx] = { ...categories[idx], ...category };
  } else {
    category.id = generateId("cat");
    categories.push(category);
  }
  write(KEYS.CATEGORIES, categories);
  return category;
}

export function deleteCategory(id) {
  const categories = getCategories().filter((c) => c.id !== id);
  write(KEYS.CATEGORIES, categories);
}

/* ---------------------------------------------------------------------
 * Eventos
 * ------------------------------------------------------------------- */
export function getEvents() {
  return read(KEYS.EVENTS);
}

export function getEventById(id) {
  return getEvents().find((e) => e.id === id) || null;
}

export function saveEvent(event) {
  const events = getEvents();
  if (event.id) {
    const idx = events.findIndex((e) => e.id === event.id);
    if (idx !== -1) events[idx] = { ...events[idx], ...event };
  } else {
    event.id = generateId("evt");
    events.push(event);
  }
  write(KEYS.EVENTS, events);
  return event;
}

export function deleteEvent(id) {
  const events = getEvents().filter((e) => e.id !== id);
  write(KEYS.EVENTS, events);
}

/**
 * Devuelve eventos aplicando filtros de búsqueda por nombre, ciudad y
 * categoría. La búsqueda por nombre ignora mayúsculas/tildes y hace
 * coincidencia por substring (incluye coincidencias aproximadas).
 */
export function searchEvents({ query = "", city = "", categoryId = "" } = {}) {
  const normalize = (str) =>
    (str || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const q = normalize(query);
  const qWords = q.split(/\s+/).filter(Boolean);

  return getEvents().filter((evt) => {
    if (city && evt.city !== city) return false;
    if (categoryId && evt.categoryId !== categoryId) return false;
    if (!q) return true;

    const haystack = normalize(evt.name);
    if (haystack.includes(q)) return true;
    // Coincidencia aproximada: todas las palabras buscadas aparecen en el nombre
    return qWords.every((w) => haystack.includes(w));
  });
}

/* ---------------------------------------------------------------------
 * Carrito de compras
 * ------------------------------------------------------------------- */
export function getCart() {
  return read(KEYS.CART);
}

function persistCart(cart) {
  write(KEYS.CART, cart);
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart } }));
  return cart;
}

export function addToCart(eventId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.eventId === eventId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ eventId, quantity });
  }
  return persistCart(cart);
}

export function removeFromCart(eventId) {
  const cart = getCart().filter((item) => item.eventId !== eventId);
  return persistCart(cart);
}

export function updateCartQuantity(eventId, quantity) {
  const cart = getCart();
  const item = cart.find((i) => i.eventId === eventId);
  if (!item) return cart;
  if (quantity <= 0) return removeFromCart(eventId);
  item.quantity = quantity;
  return persistCart(cart);
}

export function clearCart() {
  return persistCart([]);
}

/** Devuelve el carrito "hidratado" con los datos completos de cada evento. */
export function getCartDetailed() {
  const events = getEvents();
  return getCart()
    .map((item) => {
      const event = events.find((e) => e.id === item.eventId);
      if (!event) return null;
      return { ...item, event, subtotal: event.price * item.quantity };
    })
    .filter(Boolean);
}

export function getCartTotal() {
  return getCartDetailed().reduce((sum, item) => sum + item.subtotal, 0);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/* ---------------------------------------------------------------------
 * Ventas
 * ------------------------------------------------------------------- */
export function getSales() {
  return read(KEYS.SALES).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getSaleById(id) {
  return getSales().find((s) => s.id === id) || null;
}

/**
 * Registra una venta a partir del carrito actual + datos del comprador.
 * customer: { identification, name, address, phone, email }
 */
export function createSale(customer) {
  const items = getCartDetailed();
  if (items.length === 0) {
    throw new Error("El carrito está vacío, no se puede generar la venta.");
  }

  const sale = {
    id: generateId("sale"),
    date: new Date().toISOString(),
    customer,
    items: items.map((i) => ({
      eventId: i.eventId,
      eventName: i.event.name,
      city: i.event.city,
      unitPrice: i.event.price,
      quantity: i.quantity,
      subtotal: i.subtotal,
    })),
    // Ciudad principal del pedido (se usa para mostrar/columnar en el admin)
    city: items[0].event.city,
    total: items.reduce((sum, i) => sum + i.subtotal, 0),
  };

  const sales = read(KEYS.SALES);
  sales.push(sale);
  write(KEYS.SALES, sales);
  clearCart();
  return sale;
}

/* ---------------------------------------------------------------------
 * Sesión de administrador (usada por el front de admin más adelante)
 * ------------------------------------------------------------------- */
export function setAdminSession(value) {
  write(KEYS.ADMIN_SESSION, value);
}

export function getAdminSession() {
  const val = read(KEYS.ADMIN_SESSION);
  return Array.isArray(val) && val.length === 0 ? null : val;
}
