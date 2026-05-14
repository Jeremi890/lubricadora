const FacturaModel = require('./models-Factura');

class FacturaController {
  static async getAll(req, res) {
    try {
      const facturas = await FacturaModel.getAll();
      res.json(facturas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const resultado = await FacturaModel.create(req.body);
      res.status(201).json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = FacturaController;