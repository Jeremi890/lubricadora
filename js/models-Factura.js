const db = require('./db');
const MovimientoModel = require('./models-Movimiento');

class FacturaModel {
  static async getAll() {
    const query = `SELECT * FROM Facturas ORDER BY fecha DESC`;
    return await db.query(query);
  }

  static async create(datos) {
    // 1. Insertar Cabecera
    const queryFactura = `
      INSERT INTO Facturas (numero_factura, cliente_nombre, cliente_ruc, total, responsable, fecha)
      VALUES (@num, @cliente, @ruc, @total, @resp, GETDATE());
      SELECT SCOPE_IDENTITY() as id;
    `;
    
    const resFactura = await db.query(queryFactura, {
      num: `FAC-${Date.now().toString().slice(-6)}`, // Genera un número único
      cliente: datos.cliente_nombre,
      ruc: datos.cliente_ruc || '0000000000',
      total: datos.total,
      resp: datos.responsable
    });

    const facturaId = resFactura[0].id;

    // 2. Insertar Detalles y generar Movimientos de Salida
    for (const item of datos.productos) {
      const queryDetalle = `
        INSERT INTO DetalleFacturas (factura_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES (@fId, @pId, @cant, @precio, @sub);
      `;
      await db.query(queryDetalle, {
        fId: facturaId,
        pId: item.id,
        cant: item.cantidad,
        precio: item.precio_venta,
        sub: item.cantidad * item.precio_venta
      });

      await MovimientoModel.create({
        producto_id: item.id,
        tipo: 'Salida',
        cantidad: item.cantidad,
        referencia: `Factura #${facturaId}`,
        responsable: datos.responsable
      });
    }

    return { id: facturaId };
  }
}

module.exports = FacturaModel;