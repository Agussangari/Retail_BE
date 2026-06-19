const express = require('express');
const { z } = require('zod');
const CustomerController = require('../controllers/customer.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

const customerSchema = z.object({
  body: z.object({
    razon_social: z.string().min(1),
    cuit: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    telefono: z.string().optional(),
    direccion: z.string().optional(),
    activo: z.boolean().optional(),
  }),
});

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtiene todos los clientes
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/', CustomerController.getAll);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtiene un cliente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Cliente encontrado
 */
router.get('/:id', CustomerController.getById);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crea un nuevo cliente
 *     responses:
 *       201:
 *         description: Cliente creado
 */
router.post('/', validate(customerSchema), CustomerController.create);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualiza un cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Cliente actualizado
 */
router.put('/:id', validate(customerSchema), CustomerController.update);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Elimina un cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Cliente eliminado
 */
router.delete('/:id', CustomerController.delete);

module.exports = router;
