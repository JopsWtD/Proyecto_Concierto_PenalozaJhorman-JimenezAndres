import { sidebar } from "../../components/sidebar.js";

export function dashboard() {
    return `
    <section class="admin-view-container">
    ${sidebar()}
        <div id="admin-view-section">
            <article id="dashboard-overview">
                <h2>Vista general</h2>
                <p>Seguimiento del rendimiento de los eventos y de la venta de los tickets en todas las regiones.</p>
                <div id="performance-container">
                    <div class="performance-stats">
                        <p class="icon">Ícono</p>
                        <div class="performance-text">
                            <p>EVENTOS</p>
                            <p>1284</p>
                        </div>
                    </div>
                    <div class="performance-stats">
                        <p class="icon">Ícono</p>
                        <div class="performance-text">
                            <p>TICKETS</p>
                            <p>10.000</p>
                        </div>
                    </div>
                    <div class="performance-stats">
                        <p class="icon">Ícono</p>
                        <div class="performance-text">
                            <p>CATEGORÍAS</p>
                            <p>18</p>
                        </div>
                    </div>
                    <div class="performance-stats">
                        <p class="icon">Ícono</p>
                        <div class="performance-text">
                            <p>GANANCIAS</p>
                            <p>$2.4M</p>
                        </div>
                    </div>
                </div>
            </article>

            <div id ="dashboard-grid-handler">
                <article id="recent-sales-container">
                <h2>Últimas ventas</h3>
                    <ul id="recent-sales">
                    ${datosPrueba()}
                    </ul>
                </article>
                <article id="genres-popularity-container">
                    <h3>Géneros populares</h3>
                    <div id="genres-popularity">
                    </div>
                </article>
            </div>
        </div>
    </section>
    `;
}

function datosPrueba() {
    return `<li>
    <span>DATE</span>
    <span>CUSTOMER</span>
    <span>CITY</span>
    <span>TOTAL</span>
    <span>ACTION</span>
    </li>`;
}