-- src/db/migrations.sql
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  razon_social VARCHAR(255) NOT NULL,
  cuit VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(50),
  direccion TEXT,
  activo BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  precio_costo NUMERIC(10, 2) NOT NULL,
  precio_venta NUMERIC(10, 2) NOT NULL,
  stock_actual INTEGER DEFAULT 0,
  stock_minimo INTEGER DEFAULT 0,
  categoria_id INTEGER REFERENCES categorias(id),
  activo BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS ventas (
  id SERIAL PRIMARY KEY,
  numero_comprobante VARCHAR(50) UNIQUE NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cliente_id INTEGER REFERENCES clientes(id),
  subtotal NUMERIC(10, 2) NOT NULL,
  descuento NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'anulada')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detalle_ventas (
  id SERIAL PRIMARY KEY,
  venta_id INTEGER REFERENCES ventas(id),
  producto_id INTEGER REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL
);
