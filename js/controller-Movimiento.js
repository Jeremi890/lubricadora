const MovimientoModel = require('./models-Movimiento');

class MovimientoController {
  static async getAll(req, res) {
    try {
      const movimientos = await MovimientoModel.getAll();
      res.json(movimientos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const datos = req.body;
      
      if (!datos.producto_id || !datos.tipo || !datos.cantidad) {
        return res.status(400).json({ error: 'Faltan campos requeridos (producto_id, tipo, cantidad)' });
      }
      
      const resultado = await MovimientoModel.create(datos);
      res.status(201).json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = MovimientoController;