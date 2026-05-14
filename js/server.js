// SERVIDOR PRINCIPAL EXPRESS
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const productosRoutes = require('./routes-productos');
const movimientosRoutes = require('./routes-movimientos');
const facturasRoutes = require('./routes-facturas');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// RUTAS API
app.use('/api/productos', productosRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/facturas', facturasRoutes);

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// INICIAR SERVIDOR
app.listen(PORT, async () => {
  try {
    await db.connect();
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Comprueba: http://localhost:${PORT}/health`);
  } catch (err) {
    console.error('Error iniciando servidor:', err);
    process.exit(1);
  }
});

// GRACEFUL SHUTDOWN
process.on('SIGINT', async () => {
  console.log('\nCerrando servidor...');
  await db.close();
  process.exit(0);
});

module.exports = app;
