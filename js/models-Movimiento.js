const db = require('./db');

class MovimientoModel {
  // Obtener todo el historial mezclado con el nombre del producto
  static async getAll() {
    const query = `
      SELECT m.id, m.tipo, m.cantidad, m.referencia, m.responsable, m.fecha,
             p.nombre as producto_nombre, p.codigo as producto_codigo
      FROM Movimientos m
      JOIN Productos p ON m.producto_id = p.id
      ORDER BY m.fecha DESC
    `;
    return await db.query(query);
  }

  // Crear un movimiento Y actualizar el stock automáticamente
  static async create(datos) {
    // 1. Insertar el registro en el historial
    const queryInsert = `
      INSERT INTO Movimientos (producto_id, tipo, cantidad, referencia, responsable, fecha)
      VALUES (@producto_id, @tipo, @cantidad, @referencia, @responsable, GETDATE());
      
      SELECT SCOPE_IDENTITY() as id;
    `;
    
    const result = await db.query(queryInsert, {
      producto_id: datos.producto_id,
      tipo: datos.tipo,
      cantidad: datos.cantidad,
      referencia: datos.referencia || 'Ajuste manual',
      responsable: datos.responsable || 'Sistema'
    });

    // 2. Actualizar el stock del producto
    // Si es entrada suma (1), si es salida resta (-1)
    const multiplicador = datos.tipo === 'Entrada' ? 1 : -1;
    const queryStock = `
      UPDATE Productos 
      SET stock = stock + (@cantidad * @multiplicador),
          fecha_actualizacion = GETDATE()
      WHERE id = @producto_id
    `;
    
    await db.query(queryStock, {
      cantidad: datos.cantidad,
      multiplicador: multiplicador,
      producto_id: datos.producto_id
    });

    return result[0];
  }
}

module.exports = MovimientoModel;