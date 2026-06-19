const db = require('../config/db');

class CategoryRepository {
  async findAll() {
    const result = await db.query('SELECT * FROM categorias ORDER BY id ASC');
    return result.rows;
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return result.rows[0];
  }

  async create(data) {
    const result = await db.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [data.nombre, data.descripcion]
    );
    return result.rows[0];
  }

  async update(id, data) {
    const result = await db.query(
      'UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [data.nombre, data.descripcion, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = new CategoryRepository();
