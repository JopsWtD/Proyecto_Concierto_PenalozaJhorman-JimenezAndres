import { openModal, closeModal } from "./modal.js";
import { showToast } from "./toast.js";
import { createSuggestion } from "../handlers/suggestionsHandlers.js";

class SuggestionsModal extends HTMLElement {
    open() {
        openModal(`
        <div id="suggestions-modal">
            <span id="suggestions-modal-icon">💬</span>
            <h3>Buzón de sugerencias</h3>
            <p id="suggestions-modal-subtitle">Cuéntanos qué podemos mejorar. Tu opinión nos ayuda a crecer.</p>

            <form id="suggestions-form" novalidate>
                <label>
                    Nombre
                    <input type="text" id="suggestion-name" name="nombre" placeholder="Tu nombre">
                    <span class="suggestions-field-error" data-for="suggestion-name">Escribe tu nombre.</span>
                </label>

                <label>
                    Correo electrónico
                    <input type="email" id="suggestion-email" name="email" placeholder="tucorreo@mail.com">
                    <span class="suggestions-field-error" data-for="suggestion-email">Escribe tu correo.</span>
                </label>

                <label>
                    Sugerencia
                    <textarea id="suggestion-text" name="sugerencia" placeholder="Escribe tu sugerencia aquí..."></textarea>
                    <span class="suggestions-field-error" data-for="suggestion-text">Escribe tu sugerencia.</span>
                </label>

                <button type="submit" id="suggestions-submit-btn">Enviar sugerencia</button>
            </form>
        </div>`);

        this.initializeEvents();
    }

    initializeEvents() {
        const form = document.querySelector("#suggestions-form");

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.procesarEnvio(form);
        });
    }

    procesarEnvio(form) {
        const nombreInput = form.querySelector("#suggestion-name");
        const emailInput = form.querySelector("#suggestion-email");
        const textoInput = form.querySelector("#suggestion-text");

        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const mensaje = textoInput.value.trim();

        this.marcarCampo(nombreInput, nombre.length > 0);
        this.marcarCampo(emailInput, email.length > 0);
        this.marcarCampo(textoInput, mensaje.length > 0);

        if (!nombre || !email || !mensaje) {
            return;
        }

        createSuggestion({ nombre, email, mensaje });
        showToast("¡Tu sugerencia se envió correctamente!", "success");
        closeModal();
    }

    marcarCampo(input, esValido) {
        const error = input.closest("label").querySelector(".suggestions-field-error");

        input.classList.toggle("is-invalid", !esValido);
        error.classList.toggle("visible", !esValido);
    }
}

customElements.define("suggestions-modal", SuggestionsModal);