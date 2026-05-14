// MODELO DE PRODUCTOS
const db = require('../db');

class ProductoModel {
  static async getAll() {
    const query = `
      SELECT 
        id, nombre, codigo, categoria, precio_compra, 
        precio_venta, stock, stock_minimo, proveedor,
        fecha_creacion, fecha_actualizacion
      FROM Productos
      ORDER BY nombre
    `;
    return await db.query(query);
  }

  static async getById(id) {
    const query = `
      SELECT * FROM Productos WHERE id = @id
    `;
    const result = await db.query(query, { id });
    return result[0];
  }

  static async create(datos) {
    const query = `
      INSERT INTO Productos 
      (nombre, codigo, categoria, precio_compra, precio_venta, stock, stock_minimo, proveedor, fecha_creacion, fecha_actualizacion)
      VALUES 
      (@nombre, @codigo, @categoria, @precio_compra, @precio_venta, @stock, @stock_minimo, @proveedor, GETDATE(), GETDATE())
      
      SELECT SCOPE_IDENTITY() as id
    `;
    
    const result = await db.query(query, {
      nombre: datos.nombre,
      codigo: datos.codigo,
      categoria: datos.categoria,
      precio_compra: datos.precio_compra,
      precio_venta: datos.precio_venta,
      stock: datos.stock,
      stock_minimo: datos.stock_minimo,
      proveedor: datos.proveedor
    });
    
    return result[0];
  }

  static async update(id, datos) {
    const query = `
      UPDATE Productos SET 
        nombre = @nombre,
        codigo = @codigo,
        categoria = @categoria,
        precio_compra = @precio_compra,
        precio_venta = @precio_venta,
        stock = @stock,
        stock_minimo = @stock_minimo,
        proveedor = @proveedor,
        fecha_actualizacion = GETDATE()
      WHERE id = @id
    `;
    
    await db.query(query, {
      id,
      nombre: datos.nombre,
      codigo: datos.codigo,
      categoria: datos.categoria,
      precio_compra: datos.precio_compra,
      precio_venta: datos.precio_venta,
      stock: datos.stock,
      stock_minimo: datos.stock_minimo,
      proveedor: datos.proveedor
    });
    
    return this.getById(id);
  }

  static async delete(id) {
    const query = `DELETE FROM Productos WHERE id = @id`;
    await db.query(query, { id });
    return { success: true };
  }

  static async updateStock(id, cantidad) {
    const query = `
      UPDATE Productos SET stock = stock + @cantidad, fecha_actualizacion = GETDATE()
      WHERE id = @id
    `;
    await db.query(query, { id, cantidad });
    return this.getById(id);
  }

  static async getBajoStock() {
    const query = `
      SELECT * FROM Productos WHERE stock <= stock_minimo
      ORDER BY stock ASC
    `;
    return await db.query(query);
  }
}

module.exports = ProductoModel;
