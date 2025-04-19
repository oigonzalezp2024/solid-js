# 🎢 **Construye Tu Mundo 3D con un Tren Mágico** 🚂🌟

¡Hola, creadores! Esta guía te llevará paso a paso para construir un emocionante proyecto en 3D usando **Express**, **Three.js**, **Vite** y herramientas esenciales como **dotenv** para gestionar configuraciones específicas tanto en desarrollo como en producción. ¡Empecemos!

---

## 🛠 **Paso 1: Preparamos el Taller Mágico**

1. **Inicia tu proyecto:**
   Abre tu terminal y ejecuta los siguientes comandos:
   ```bash
   mkdir taller-magico
   cd taller-magico
   npm init -y
   npm install express three compression dotenv
   npm install --save-dev vite
   ```

   - **Express**: Para servir tus archivos en producción.
   - **Three.js**: Para construir el mundo mágico en 3D.
   - **Compression**: Optimiza las respuestas HTTP en producción.
   - **Dotenv**: Administra configuraciones para desarrollo y producción.
   - **Vite**: Facilita el desarrollo con su servidor ágil y sus optimizaciones.

2. **Configura el archivo package.json:**
   Ajusta el archivo `package.json` con el siguiente contenido:

   ```json
   {
     "name": "solid",
     "version": "1.0.0",
     "description": "Entrenamiento de refactorización - Principios SOLID en Javascript",
     "main": "index.js",
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "start": "node server.js"
     },
     "repository": {
       "type": "git",
       "url": "git+https://github.com/oigonzalezp2024/solid-js.git"
     },
     "keywords": [],
     "author": "",
     "license": "ISC",
     "bugs": {
       "url": "https://github.com/oigonzalezp2024/solid-js/issues"
     },
     "homepage": "https://github.com/oigonzalezp2024/solid-js#readme",
     "dependencies": {
       "compression": "^1.8.0",
       "dotenv": "^16.5.0",
       "express": "^5.1.0",
       "three": "^0.175.0"
     },
     "devDependencies": {
       "vite": "^6.3.2"
     }
   }
   ```

---

## 🛠 **Paso 2: Organiza las carpetas**

Estructura tu proyecto de esta forma:
```bash
taller-magico/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── robots.txt
├── server.js
├── package.json
├── vite.config.js
├── .env
├── .env.production.local
└── node_modules/
```

---

## 💻 **Paso 3: Configuraciones con Dotenv**

1. **Crea archivos `.env`:**
   - Para **desarrollo**, utiliza un archivo `.env`:
     ```bash
     NODE_ENV=development
     PORT=3000
     ```
   - Para pruebas locales de **producción**, crea un archivo `.env.production.local`:
     ```bash
     NODE_ENV=production
     PORT=8080
     ```

2. **Asegúrate de que estos archivos no se suban al repositorio:**
   Añade estas líneas a `.gitignore`:
   ```bash
   .env
   .env.production.local
   ```

---

## 🌟 **Paso 4: Construimos el Mundo Mágico**

1. **Crea el portal al mundo mágico (HTML):**
   En la carpeta `public/`, crea un archivo `index.html` con el siguiente contenido:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta name="description" content="Explora un emocionante mundo 3D interactivo donde un tren mágico cobra vida, desarrollado con Three.js y Express. ¡Sumérgete en la aventura!">
     <title>Tren Mágico</title>
     <link rel="stylesheet" href="style.css">
   </head>
   <body>
     <script type="module" src="script.js"></script>
   </body>
   </html>
   ```

2. **Agrega estilos indispensables (CSS):**
   Crea un archivo `style.css` en la carpeta `public/`:
   ```css
   /* Estilos indispensables */
   body {
       margin: 0;
       overflow: hidden;
       /* Oculta barras de desplazamiento */
       font-family: 'Roboto', sans-serif;
       background-color: #aee2ff;
       /* Fondo del mundo 3D */
   }

   canvas {
       display: block;
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       z-index: -1;
       /* Coloca el canvas detrás de otros elementos */
   }
   ```

3. **Agrega la magia (JavaScript):**
   Crea un archivo `script.js` en la carpeta `public/`:

   ```javascript
   import * as THREE from 'three';

    // =======================
    // Configuración inicial
    // =======================

    let angle = 0;
    let speed = 0.01;
    const baseSpeed = 0.01;
    const maxSpeed = 0.07;
    const speedDecay = 0.0005;
    let lastMouseX = null;
    let lastMouseMoveTime = Date.now();

    let scene, camera, renderer, tren;

    // =======================
    // Funciones de creación
    // =======================

    function crearEscena() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xaee2ff);
    }

    function crearCamara() {
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 8, 20);
    }

    function crearRenderer() {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
    }

    function crearIluminacion() {
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(10, 20, 10);
      scene.add(light);
    }

    function crearOficina() {
      const oficina = new THREE.Group();

      const paredes = new THREE.Mesh(
        new THREE.BoxGeometry(10, 5, 10),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      paredes.position.y = 2.5;

      const techo = new THREE.Mesh(
        new THREE.BoxGeometry(10.2, 0.5, 10.2),
        new THREE.MeshLambertMaterial({ color: 0xff0000 })
      );
      techo.position.y = 5.25;

      oficina.add(paredes);
      oficina.add(techo);
      scene.add(oficina);
    }

    function crearTren() {
      tren = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 2),
        new THREE.MeshLambertMaterial({ color: 0x3333ff })
      );
      tren.position.set(8, 0.5, 0);
      scene.add(tren);
    }

    function manejarMouse() {
      window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (lastMouseX !== null) {
          const deltaX = e.clientX - lastMouseX;
          const deltaTime = now - lastMouseMoveTime;

          if (deltaTime < 50) {
            const acceleration = deltaX * 0.0005;
            speed += acceleration;
            speed = Math.max(baseSpeed, Math.min(maxSpeed, speed));
          }
        }
        lastMouseX = e.clientX;
        lastMouseMoveTime = Date.now();
      });
    }

    function loopAnimacion() {
      requestAnimationFrame(loopAnimacion);

      const tiempoSinMovimiento = Date.now() - lastMouseMoveTime;
      if (tiempoSinMovimiento > 100 && speed > baseSpeed) {
        speed -= speedDecay;
        if (speed < baseSpeed) speed = baseSpeed;
      }

      angle -= speed;
      tren.position.x = Math.cos(angle) * 8;
      tren.position.z = Math.sin(angle) * 8;
      tren.rotation.y = -angle + Math.PI / 2;

      renderer.render(scene, camera);
    }

    // =======================
    // Inicialización
    // =======================

    function inicializar() {
      crearEscena();
      crearCamara();
      crearRenderer();
      crearIluminacion();
      crearOficina();
      crearTren();
      manejarMouse();
      loopAnimacion();
    }

    inicializar();

    // Ajuste de pantalla
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

   ```

---

## 🚀 **Paso 5: Configuración del Servidor**

Crea un archivo `server.js` para manejar la producción:
```javascript
require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();

app.use(compression());
app.use('/robots.txt', express.static(path.join(__dirname, 'robots.txt')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
} else {
  console.log('Ejecutando en modo desarrollo');
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🌍 Servidor activo en http://localhost:${PORT}`));
```

---

## ⚡ **Paso 6: Desarrollo y Producción**

1. **En desarrollo:**
   Ejecuta el servidor de Vite para probar el proyecto:
   ```bash
   npm run dev
   ```

2. **En producción:**
   - Genera los archivos optimizados:
     ```bash
     npm run build
     ```
   - Inicia el servidor para producción:
     ```bash
     npm run start
     ```

---

## 🎉 **¡Felicidades!**
Tu proyecto está ahora completamente configurado para desarrollo y producción, con pruebas locales de producción gracias a `.env.production.local`. Puedes probar, desplegar y compartir tu Tren Mágico 3D con el mundo. 🚂✨
