require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();

// Activa la compresión para optimizar las respuestas en producción
app.use(compression());

// Sirve el archivo robots.txt
app.use('/robots.txt', express.static(path.join(__dirname, 'robots.txt')));

// Sirve los archivos estáticos en producción desde la carpeta "dist"
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
} else {
  console.log('Ejecutando en modo desarrollo.');
}

// Configura el puerto desde variables de entorno o usa el predeterminado
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🌍 Servidor activo en http://localhost:${PORT}`));