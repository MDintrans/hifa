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
│   │   └── logo-hifa-dark.svg
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
