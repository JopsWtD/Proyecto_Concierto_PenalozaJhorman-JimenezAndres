import { login } from "../auth.js";
import { showToast } from "./toast.js";

class LoginModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section id="login-container">
            <form id="login-form">
                <h2>Conciertos Conectados</h2>
                <p>Ingresa a tu panel de administración</p>
                <label>
                    Correo electrónico
                    <input type="email" id="login-email" required placeholder="admin@mail.com">
                </label>
                <label>
                    Contraseña
                    <input type="password" id="login-password" required placeholder="••••••••">
                </label>
                <button type="submit">Ingresar</button>
            </form>
        </section>`;

        this.initializeEvents();
    }

    initializeEvents() {
        const form = this.querySelector("#login-form");

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = this.querySelector("#login-email").value.trim();
            const password = this.querySelector("#login-password").value.trim();

            if (login(email, password)) {
                showToast("Inicio de sesión exitoso", "success");
                window.location.hash = "#dashboard";
            } else {
                showToast("Correo o contraseña incorrectos", "error");
            }
        });
    }
}

customElements.define("login-modal", LoginModal);
