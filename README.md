# HIFA Systems

Sitio institucional de HIFA Systems, preparado como una página estática y responsive.

## Estructura

```text
.
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── img/
│   │   ├── favicon.svg
│   │   ├── logo-hifa.svg
│   │   ├── logo-hifa-dark.svg
│   │   └── logo-hifa-stacked-dark.svg
│   └── js/
│       └── script.js
├── .nojekyll
└── README.md
```

## Vista local

Desde la raíz del repositorio:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Después abre `http://127.0.0.1:4173/` en el navegador.

## Despliegue

GitHub Pages publica la rama `main` desde la raíz del repositorio. Cada actualización enviada a esa rama genera automáticamente una nueva versión del sitio.

Sitio público: <https://mdintrans.github.io/hifa/>

## Configuración de contacto

Los canales y el destino del formulario se centralizan en `assets/js/contact-config.js`:

- `whatsappNumber`: número con código de país y solo dígitos (por ejemplo, `56912345678`).
- `contactEmail`: correo que se muestra y abre el botón de correo.
- `formEndpoint`: URL de un servicio de formularios compatible con `POST` y `FormData` (por ejemplo, el endpoint asignado por Formspree).

Si `formEndpoint` está vacío, el formulario descarga un respaldo local y avisa que el envío todavía no está configurado. Así se puede definir la casilla de destino más adelante sin modificar el formulario.
