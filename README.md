# Norte Sur Toyota - Frontend

Aplicacion web solo frontend construida con React + JavaScript (Vite), basada en el documento funcional de experiencia Norte Sur Toyota.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Ejecutar en local

1. Instalar dependencias:

	npm install

2. Iniciar entorno de desarrollo:

	npm run dev

3. Compilar para produccion:

	npm run build

4. Previsualizar build:

	npm run preview

## Estructura principal

- src/App.jsx: composicion de secciones y comportamiento UI
- src/data/content.js: contenido y textos de la experiencia
- src/components/FallingCranes.jsx: animacion visual de grullas
- src/components/PointsTable.jsx: tabla de puntos y beneficios
- public/images/doc: imagenes extraidas del documento

## Despliegue en Vercel

Este proyecto ya incluye vercel.json con rewrite para SPA.

1. Sube el repositorio a GitHub.
2. Entra a Vercel, crea un proyecto e importa el repo.
3. Vercel detectara Vite automaticamente.
4. Verifica estos parametros (si te los pide):
	- Build Command: npm run build
	- Output Directory: dist
5. Despliega.

## Notas

- No requiere backend para mostrar contenido, interacciones de UI e imagenes.
- La subida de origami es demostrativa en frontend (vista previa local del archivo).
