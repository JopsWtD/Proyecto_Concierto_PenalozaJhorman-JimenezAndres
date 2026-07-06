import "../../components/sidebar.js";

export function sales() {
    return `
    <section class="admin-view-container">

    <sidebar-admin></sidebar-admin>

        <div id="admin-view-section">

            <article id="create-overview">
                <h2>Administración de ventas</h2>
                <button> + Registrar venta</button>
                <p>Vista general de todas las ventas realizadas.</p>
            </article>
            
            <div id="management-container">

                <div id="filter-container">

                    <input placeholder="Buscar ventas...">

                    <div id="management-buttons">
                        <button>Todas las ventas</button>
                        <button>Pendientes</button>
                        <button>Completadas</button>
                    </div>

                </div>

                <div id="management-list">
                    ${datosPrueba()}
                </div>

            </div>

            <div id="performance-container">

                <div class="performance-stats">
                    <p class="icon">Ícono</p>

                    <div class="performance-text">
                        <p>TOTAL VENTAS</p>
                        <p>128</p>
                    </div>
                </div>

                <div class="performance-stats">
                    <p class="icon">Ícono</p>

                    <div class="performance-text">
                        <p>INGRESOS TOTALES</p>
                        <p>$12,850</p>
                    </div>
                </div>

                <div class="performance-stats">
                    <p class="icon">Ícono</p>

                    <div class="performance-text">
                        <p>TICKETS VENDIDOS</p>
                        <p>347</p>
                    </div>
                </div>

            </div>

        </div>

    </section>
    `;
}

function datosPrueba() {
    return `
    <li>
        <span>SALE ID</span>
        <span>CLIENT</span>
        <span>EVENT</span>
        <span>DATE</span>
        <span>QUANTITY</span>
        <span>TOTAL</span>
        <span>STATUS</span>
        <span>ACTIONS</span>
    </li>
    `;
}