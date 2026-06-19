const db = require('../config/db');

class ProductRepository {
  async findAll() {
    const result = await db.query('SELECT * FROM productos ORDER BY id ASC');
    return result.rows;
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM productos WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findLowStock() {
    const result = await db.query('SELECT * FROM productos WHERE stock_actual <= stock_minimo');
    return result.rows;
  }

  async create(data) {
    const result = await db.query(
      `INSERT INTO productos 
       (codigo, descripcion, precio_costo, precio_venta, stock_actual, stock_minimo, categoria_id, activo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [data.codigo, data.descripcion, data.precio_costo, data.precio_venta, data.stock_actual || 0, data.stock_minimo || 0, data.categoria_id, data.activo !== false]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const result = await db.query(
      `UPDATE productos SET 
       codigo = $1, descripcion = $2, precio_costo = $3, precio_venta = $4, 
       stock_actual = $5, stock_minimo = $6, categoria_id = $7, activo = $8
       WHERE id = $9 RETURNING *`,
      [data.codigo, data.descripcion, data.precio_costo, data.precio_venta, data.stock_actual, data.stock_minimo, data.categoria_id, data.activo, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new ProductRepository();
