const db = require('../config/db');

class SaleRepository {
  async findAll(filters = {}) {
    let query = 'SELECT * FROM ventas';
    let params = [];
    let conditions = [];

    if (filters.fecha) {
      conditions.push(`DATE(fecha) = $${params.length + 1}`);
      params.push(filters.fecha);
    }
    
    if (filters.cliente_id) {
      conditions.push(`cliente_id = $${params.length + 1}`);
      params.push(filters.cliente_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY fecha DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  async findById(id) {
    const saleResult = await db.query('SELECT * FROM ventas WHERE id = $1', [id]);
    const sale = saleResult.rows[0];

    if (!sale) return null;

    const detailsResult = await db.query(
      `SELECT dv.*, p.codigo, p.descripcion 
       FROM detalle_ventas dv 
       JOIN productos p ON dv.producto_id = p.id 
       WHERE dv.venta_id = $1`, 
      [id]
    );
    
    sale.items = detailsResult.rows;
    return sale;
  }

  async create(saleData, items, client) {
    // client is passed to use inside a transaction
    const saleResult = await client.query(
      `INSERT INTO ventas 
       (numero_comprobante, cliente_id, subtotal, descuento, total, estado) 
       VALUES ($1, $2, $3, $4, $5, 'confirmada') RETURNING *`,
      [saleData.numero_comprobante, saleData.cliente_id, saleData.subtotal, saleData.descuento || 0, saleData.total]
    );

    const sale = saleResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO detalle_ventas 
         (venta_id, producto_id, cantidad, precio_unitario, subtotal) 
         VALUES ($1, $2, $3, $4, $5)`,
        [sale.id, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
      );
    }

    return sale;
  }

  async updateState(id, estado, client) {
    const queryClient = client || db;
    const result = await queryClient.query(
      'UPDATE ventas SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    return result.rows[0];
  }
}

module.exports = new SaleRepository();
