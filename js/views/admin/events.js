import "../../components/sidebar.js";

export function events() {
    return `
    <section class="admin-view-container">

    <sidebar-admin></sidebar-admin>

        <div id="admin-view-section">
            <article id="create-overview">
                <h2>Administración de eventos</h2>
                <button> + Crear evento</button>
                <p>Vista general de todos los eventos existentes y por existir.</p>
            </article>
            
            <div id="management-container">

                <div id="filter-container">
                    <input placeholder="Buscar eventos...">

                    <div id="management-buttons">
                        <button>Todos los eventos</button>
                        <button>Borradores</button>
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
                        <p>CATEGORÍAS</p>
                        <p>18</p>
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
                    <p>CATEGORÍAS</p>
                    <p>18</p>
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
        <span>IMAGE</span>
        <span>CODE</span>
        <span>NAME</span>
        <span>CATEGORY</span>
        <span>CITY</span>
        <span>DATE</span> 
        <span>PRICE</span>  
        <span>ACTIONS</span> 
    </li>
    `;
}