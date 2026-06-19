const express = require('express');
const { z } = require('zod');
const SaleController = require('../controllers/sale.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

const saleSchema = z.object({
  body: z.object({
    numero_comprobante: z.string().min(1),
    cliente_id: z.number().int().positive(),
    descuento: z.number().min(0).optional(),
    items: z.array(z.object({
      producto_id: z.number().int().positive(),
      cantidad: z.number().int().positive(),
    })).min(1, 'At least one item is required'),
  }),
});

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Obtiene lista de ventas (con filtros opcionales)
 *     parameters:
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha (YYYY-MM-DD)
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de cliente
 *     responses:
 *       200:
 *         description: Lista de ventas
 */
router.get('/', SaleController.getAll);

/**
 * @swagger
 * /api/ventas/{id}:
 *   get:
 *     summary: Obtiene una venta por ID con todos sus detalles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Venta y sus items
 */
router.get('/:id', SaleController.getById);

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Crea una venta y descuenta stock
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 */
router.post('/', validate(saleSchema), SaleController.create);

/**
 * @swagger
 * /api/ventas/{id}/anular:
 *   patch:
 *     summary: Anula una venta y repone el stock
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Venta anulada y stock devuelto
 */
router.patch('/:id/anular', SaleController.cancel);

module.exports = router;
