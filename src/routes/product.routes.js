const express = require('express');
const { z } = require('zod');
const ProductController = require('../controllers/product.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

const productSchema = z.object({
  body: z.object({
    codigo: z.string().min(1),
    descripcion: z.string().min(1),
    precio_costo: z.number().positive(),
    precio_venta: z.number().positive(),
    stock_actual: z.number().int().min(0).optional(),
    stock_minimo: z.number().int().min(0).optional(),
    categoria_id: z.number().int().positive().optional(),
    activo: z.boolean().optional(),
  }),
});

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtiene todos los productos
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/', ProductController.getAll);

/**
 * @swagger
 * /api/productos/stock-bajo:
 *   get:
 *     summary: Obtiene productos bajo stock mínimo
 *     responses:
 *       200:
 *         description: Lista de productos con stock bajo
 */
router.get('/stock-bajo', ProductController.getLowStock);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Producto encontrado
 */
router.get('/:id', ProductController.getById);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.post('/', validate(productSchema), ProductController.create);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualiza un producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put('/:id', validate(productSchema), ProductController.update);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Elimina un producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete('/:id', ProductController.delete);

module.exports = router;
