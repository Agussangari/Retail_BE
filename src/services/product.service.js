const ProductRepository = require('../repositories/product.repository');
const { NotFoundError } = require('../utils/errors');

class ProductService {
  async getAllProducts() {
    return await ProductRepository.findAll();
  }

  async getProductById(id) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    return product;
  }

  async getLowStockProducts() {
    return await ProductRepository.findLowStock();
  }

  async createProduct(data) {
    return await ProductRepository.create(data);
  }

  async updateProduct(id, data) {
    await this.getProductById(id);
    return await ProductRepository.update(id, data);
  }

  async deleteProduct(id) {
    await this.getProductById(id);
    return await ProductRepository.delete(id);
  }
}

module.exports = new ProductService();
