# Conciertos Conectados

Plataforma web para la empresa organizadora de eventos **Conciertos Conectados**. Permite que un administrador gestione categorías, eventos y ventas, y que los clientes consulten eventos, los agreguen al carrito y realicen una compra simulada.

Construida con **HTML + CSS + JavaScript puro**, sin frameworks. Toda la información se conserva en el navegador usando **localStorage**.

## Integrantes

- Jhorman Fabian Peñaloza Sierra — Front de Administración (login, dashboard, categorías, eventos, ventas) e integración
- Andrés Jiménez — Front de Eventos para Clientes (vista principal, catálogo, detalle, carrito)

## Funcionalidades

### Front de Administración

- **Login** con email `admin@mail.com` y contraseña `123456`. Protege el acceso a los módulos internos.
- **Dashboard** con métricas generales de eventos, tickets, categorías y ganancias, últimas ventas y géneros más populares.
- **Módulo de Categorías**: listar, crear, editar y eliminar categorías con nombre y descripción.
- **Módulo de Eventos**: crear, actualizar y eliminar eventos con código, nombre, categoría, precio, fecha, hora, ciudad (Barranquilla, Bogotá, Bucaramanga, Medellín), imagen y descripción.
- **Módulo de Ventas**: lista de ventas ordenadas de la más reciente a la más antigua, con datos del cliente, ciudad, total y una vista de detalle completo de cada pedido.

### Front de Eventos para Clientes

- **Vista principal**: hero, buscador, eventos destacados, categorías y próximos eventos.
- **Catálogo de eventos**: buscador por nombre en tiempo real más filtros por ciudad y por categoría.
- **Detalle del evento**: imagen ampliada, nombre, descripción, fecha, hora, precio, botón para volver y botón para agregar al carrito.
- **Carrito de compras**: modal con miniatura, nombre, precio, control de cantidad, subtotal y total. Al comprar solicita identificación, nombre, dirección, teléfono y e-mail, y registra la venta con fecha. Muestra confirmación con número de pedido.

### Persistencia

Los datos se guardan en localStorage bajo las claves `categorias`, `eventos`, `ventas`, `carrito` y `sesionAdmin`, serializando con `JSON.stringify()` y recuperando con `JSON.parse()`. El admin y el cliente comparten el mismo almacenamiento: los eventos creados en el panel aparecen en la vista pública y las compras de los clientes se ven en el módulo de ventas.

## Estructura del proyecto

```
Proyecto_Conciertos_PenalozaJhorman-JimenezAndres/
├── index.html
├── README.md
├── css/
│   ├── shared/        (main, utils, animations)
│   ├── admin/         (layout, components)
│   └── customer/      (layout, components)
└── js/
    ├── app.js
    ├── router.js
    ├── auth.js
    ├── storage.js
    ├── data-seed.js
    ├── components/    (modal, toast, sidebar, creationMenu, loginModal, ...)
    ├── handlers/      (adminHandlers, customerHandlers)
    └── views/
        ├── layouts/   (adminLayout)
        ├── admin/     (dashboard, categories, events, sales)
        └── customer/  (home, events, eventDetail)
```

## Web Components

La interfaz reutiliza componentes personalizados definidos con `customElements.define`. Del lado del administrador: `sidebar-admin`, `admin-layout`, `app-modal`, `app-toast`, `creation-menu`, `login-modal` y las vistas `dashboard-view`, `categories-view`, `events-view` y `sales-view`. Del lado del cliente: `customer-navbar`, `event-card` y `cart-modal`, reutilizando `app-modal` y `app-toast`.

## Diseño responsive

Estilos con enfoque **mobile first** y tres breakpoints (600px, 900px, 1200px). En móvil el sidebar se despliega como menú lateral y las tablas se muestran en formato tarjeta; en escritorio el sidebar es fijo y las tablas se muestran por columnas.

## Instalación y ejecución

1. Clonar el repositorio.
2. Abrir `index.html` con un servidor estático (por el uso de módulos ES). Por ejemplo:

   ```
   python -m http.server 8000
   ```

3. Ingresar a `http://localhost:8000` y usar las credenciales de administrador.
