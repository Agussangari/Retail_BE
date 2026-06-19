const db = require('../config/db');
const logger = require('../config/logger');
const fs = require('fs');
const path = require('path');

const seedData = async () => {
  try {
    const client = await db.getClient();
    
    // Run migrations first
    const migrationsPath = path.join(__dirname, 'migrations.sql');
    const migrationsSql = fs.readFileSync(migrationsPath, 'utf8');
    
    logger.info('Running migrations...');
    await client.query(migrationsSql);
    logger.info('Migrations completed.');

    // Check if categories exist
    const catCheck = await client.query('SELECT COUNT(*) FROM categorias');
    if (parseInt(catCheck.rows[0].count) === 0) {
      logger.info('Seeding data...');
      
      await client.query('BEGIN');

      // Categorias
      await client.query(`INSERT INTO categorias (nombre, descripcion) VALUES 
        ('Electrónica', 'Dispositivos electrónicos'),
        ('Ropa', 'Prendas de vestir'),
        ('Hogar', 'Artículos para el hogar')`);

      // Productos
      await client.query(`INSERT INTO productos (codigo, descripcion, precio_costo, precio_venta, stock_actual, stock_minimo, categoria_id) VALUES 
        ('PROD001', 'Smartphone XYZ', 500.00, 800.00, 50, 10, 1),
        ('PROD002', 'Camiseta Algodón', 5.00, 15.00, 100, 20, 2),
        ('PROD003', 'Licuadora 2000W', 30.00, 60.00, 30, 5, 3),
        ('PROD004', 'Auriculares Bluetooth', 20.00, 45.00, 5, 10, 1)`); // Low stock

      // Clientes
      await client.query(`INSERT INTO clientes (razon_social, cuit, email, telefono, direccion) VALUES 
        ('Empresa A', '20-12345678-9', 'contacto@empresaa.com', '123456789', 'Calle Falsa 123'),
        ('Consumidor Final B', '27-98765432-1', 'b@gmail.com', '987654321', 'Avenida Siempreviva 742')`);

      await client.query('COMMIT');
      logger.info('Seeding completed.');
    } else {
      logger.info('Database already seeded. Skipping.');
    }

    client.release();
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database', error);
    process.exit(1);
  }
};

seedData();
