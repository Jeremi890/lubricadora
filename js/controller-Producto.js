// CONTROLADOR DE PRODUCTOS
const ProductoModel = require('./models-Producto');

class ProductoController {
  static async getAll(req, res) {
    try {
      const productos = await ProductoModel.getAll();
      res.json(productos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const producto = await ProductoModel.getById(req.params.id);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(producto);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const datos = req.body;
      
      if (!datos.nombre || !datos.codigo) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }
      
      const resultado = await ProductoModel.create(datos);
      res.status(201).json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const producto = await ProductoModel.update(req.params.id, req.body);
      res.json(producto);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      await ProductoModel.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateStock(req, res) {
    try {
      const { cantidad } = req.body;
      const producto = await ProductoModel.updateStock(req.params.id, cantidad);
      res.json(producto);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getBajoStock(req, res) {
    try {
      const productos = await ProductoModel.getBajoStock();
      res.json(productos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ProductoController;
