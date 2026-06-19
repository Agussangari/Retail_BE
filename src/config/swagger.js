const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Retail API',
      version: '1.0.0',
      description: 'Documentación de la API del sistema de Retail',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Rutas donde están los comentarios de Swagger
};

const specs = swaggerJsdoc(options);

module.exports = specs;
