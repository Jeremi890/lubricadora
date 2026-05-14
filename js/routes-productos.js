// RUTAS DE PRODUCTOS
const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/Producto');

// CRUD Básico
router.get('/', ProductoController.getAll);
router.get('/:id', ProductoController.getById);
router.post('/', ProductoController.create);
router.put('/:id', ProductoController.update);
router.delete('/:id', ProductoController.delete);

// Operaciones específicas
router.patch('/:id/stock', ProductoController.updateStock);
router.get('/alertas/bajo-stock', ProductoController.getBajoStock);

module.exports = router;
