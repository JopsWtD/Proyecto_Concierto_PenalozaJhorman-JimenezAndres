import { sidebar } from "../../components/sidebar.js";

export function categories() {
    return `
    <section class="admin-view-container">

        ${sidebar()}

        <div id="admin-view-section">

            <article id="create-overview">
                <h2>Administración de categorías</h2>
                <button> + Crear categoría</button>
                <p>Vista general de todas las categorías disponibles.</p>
            </article>
            
            <div id="management-container">

                <div id="filter-container">

                    <input placeholder="Buscar categorías...">

                    <div id="management-buttons">
                        <button>Todas las categorías</button>
                        <button>Activas</button>
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
                        <p>TOTAL CATEGORÍAS</p>
                        <p>18</p>
                    </div>
                </div>

                <div class="performance-stats">
                    <p class="icon">Ícono</p>

                    <div class="performance-text">
                        <p>CATEGORÍA MÁS USADA</p>
                        <p>Rock</p>
                    </div>
                </div>

                <div class="performance-stats">
                    <p class="icon">Ícono</p>

                    <div class="performance-text">
                        <p>EVENTOS ASOCIADOS</p>
                        <p>64</p>
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
        <span>CODE</span>
        <span>NAME</span>
        <span>DESCRIPTION</span>
        <span>EVENTS</span>
        <span>STATUS</span>
        <span>ACTIONS</span>
    </li>`;
}