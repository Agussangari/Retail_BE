const CategoryService = require('../services/category.service');

class CategoryController {
  async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
