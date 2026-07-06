import { getData, saveData } from "../storage.js";

export function getCategories() {
    return getData("categorias");
}

export function createCategory({ nombre, descripcion }) {
    const categorias = getCategories();

    const categoria = {
        id: Date.now(),
        nombre,
        descripcion
    };

    categorias.push(categoria);
    saveData("categorias", categorias);

    return categoria;
}

export function updateCategory(id, { nombre, descripcion }) {
    const categorias = getCategories();
    const index = categorias.findIndex((categoria) => categoria.id === id);

    if (index === -1) return null;

    categorias[index] = { ...categorias[index], nombre, descripcion };
    saveData("categorias", categorias);

    return categorias[index];
}

export function deleteCategory(id) {
    const categorias = getCategories().filter((categoria) => categoria.id !== id);
    saveData("categorias", categorias);
}

export function getEvents() {
    return getData("eventos");
}

export function createEvent(datos) {
    const eventos = getEvents();
    const evento = { id: Date.now(), ...datos };

    eventos.push(evento);
    saveData("eventos", eventos);

    return evento;
}

export function updateEvent(id, datos) {
    const eventos = getEvents();
    const index = eventos.findIndex((evento) => evento.id === id);

    if (index === -1) return null;

    eventos[index] = { ...eventos[index], ...datos };
    saveData("eventos", eventos);

    return eventos[index];
}

export function deleteEvent(id) {
    const eventos = getEvents().filter((evento) => evento.id !== id);
    saveData("eventos", eventos);
}

export function getSales() {
    return getData("ventas").sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export function getSaleById(id) {
    return getData("ventas").find((venta) => venta.id === id);
}
