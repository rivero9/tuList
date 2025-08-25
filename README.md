# tuList | Aplicación de Gestión de Tareas

**tuList** es una aplicación de listas de tareas simple y eficiente, desarrollada completamente en el lado del cliente. Su objetivo es proporcionar una herramienta intuitiva para organizar tus actividades diarias, permitiéndote categorizar, gestionar y persistir tus listas de manera local sin necesidad de un servidor.

---

### 🌟 Características Principales

* **PWA:** Una vez cargada la aplicación web por primera vez en el navegador, esta se encuentra disponible sin conexión a internet gracias a un Service Worker capaz de almacenar los archivos y datos en la caché del navegador, lo que permite una funcionalidad total incluso sin conexión
* **Listas Categorizadas:** Organiza tus tareas en categorías personalizadas (ej. Compras, Trabajo, etc.) para mantener un control claro de tus responsabilidades.
* **Gestión de Tareas Completa (CRUD):**
    * **Crear** nuevos elementos en cada lista.
    * **Editar** el contenido de los elementos existentes.
    * **Marcar** elementos como completados.
    * **Eliminar** tareas que ya no necesitas.
* **Reordenamiento Dinámico:** Reorganiza tus tareas con facilidad. La funcionalidad de arrastrar y soltar (drag-and-drop) te permite reordenar los elementos de cualquier lista para priorizarlos como desees.
* **Persistencia de Datos:** La aplicación almacena todos tus datos de forma local en el navegador, utilizando **IndexedDB**. Esto garantiza que tus listas se guarden y estén disponibles incluso si cierras la aplicación o tu navegador.

---

### 🛠️ Tecnologías Utilizadas

Este proyecto está construido con un stack de tecnologías web estándar, centrado en la interacción del lado del cliente:

* **HTML:** Para la estructura de la aplicación.
* **CSS:** Para el estilo y el diseño visual.
* **JavaScript (Vanilla JS):** Para toda la lógica de la aplicación y la gestión de la interactividad.

---

### 🚀 Guía de Uso

Dado que **tuList** es una aplicación de cliente, no se necesita un servidor web. Sigue estos sencillos pasos para usarla:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/rivero9/tuList.git
    ```
2.  **Abre el archivo:**
    Navega hasta la carpeta del proyecto y abre el archivo `index.html` directamente en tu navegador web.

---

> Estoy en un proceso constante de aprendizaje y mejora. Este proyecto representa una de mis habilidades actuales. Estoy abierto a la retroalimentación y ansioso por aplicar nuevas técnicas y tecnologías para seguir creciendo profesionalmente.
