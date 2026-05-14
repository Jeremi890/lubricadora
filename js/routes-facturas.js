const express = require('express');
const router = express.Router();
const FacturaController = require('./controller-Factura');

router.get('/', FacturaController.getAll);
router.post('/', FacturaController.create);

module.exports = router;