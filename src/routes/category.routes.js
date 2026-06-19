const express = require('express');
const { z } = require('zod');
const CategoryController = require('../controllers/category.controller');
const validate = require('../middlewares/validate');

const router = express.Router();

const categorySchema = z.object({
  body: z.object({
    nombre: z.string().min(1, 'Name is required'),
    descripcion: z.string().optional(),
  }),
});

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtiene todas las categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/', CategoryController.getAll);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtiene una categoría por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 */
router.get('/:id', CategoryController.getById);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crea una nueva categoría
 *     responses:
 *       201:
 *         description: Categoría creada
 */
router.post('/', validate(categorySchema), CategoryController.create);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualiza una categoría
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Categoría actualizada
 */
router.put('/:id', validate(categorySchema), CategoryController.update);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Elimina una categoría
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Categoría eliminada
 */
router.delete('/:id', CategoryController.delete);

module.exports = router;
