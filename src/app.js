const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const { NotFoundError } = require('./utils/errors');

const app = express();

app.use(cors());
app.use(express.json());

const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const customerRoutes = require('./routes/customer.routes');
const saleRoutes = require('./routes/sale.routes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes will be added here
app.use('/api/categorias', categoryRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/clientes', customerRoutes);
app.use('/api/ventas', saleRoutes);

app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

app.use(errorHandler);

module.exports = app;
