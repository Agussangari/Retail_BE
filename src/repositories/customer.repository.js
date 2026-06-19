const db = require('../config/db');

class CustomerRepository {
  async findAll() {
    const result = await db.query('SELECT * FROM clientes ORDER BY id ASC');
    return result.rows;
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM clientes WHERE id = $1', [id]);
    return result.rows[0];
  }

  async create(data) {
    const result = await db.query(
      `INSERT INTO clientes 
       (razon_social, cuit, email, telefono, direccion, activo) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.razon_social, data.cuit, data.email, data.telefono, data.direccion, data.activo !== false]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const result = await db.query(
      `UPDATE clientes SET 
       razon_social = $1, cuit = $2, email = $3, telefono = $4, direccion = $5, activo = $6
       WHERE id = $7 RETURNING *`,
      [data.razon_social, data.cuit, data.email, data.telefono, data.direccion, data.activo, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new CustomerRepository();
