const express = require('express');
const router = express.Router();
const MovimientoController = require('./controller-Movimiento');

router.get('/', MovimientoController.getAll);
router.post('/', MovimientoController.create);

module.exports = router;