const ProductService = require('../services/product.service');

class ProductController {
  async getAll(req, res, next) {
    try {
      const products = await ProductService.getAllProducts();
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req, res, next) {
    try {
      const products = await ProductService.getLowStockProducts();
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
