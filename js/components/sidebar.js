export function sidebar() {
    return `<aside id="sidebar-admin">
    <h3>Admin Panel</h3>
        <div id="button-container">
        <button id ="dashboard-btn" data-route="dashboard">Dashboard</button>
        <button id ="categories-btn" data-route="categories">Categorías</button>
        <button id ="events-btn" data-route="events">Eventos</button>
        <button id ="sales-btn" data-route="sales">Ventas</button>
        <button id ="logout-btn">Cerrar sesión</button>
    </div>

    </aside>`;
}