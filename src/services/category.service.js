const CategoryRepository = require('../repositories/category.repository');
const { NotFoundError } = require('../utils/errors');

class CategoryService {
  async getAllCategories() {
    return await CategoryRepository.findAll();
  }

  async getCategoryById(id) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }
    return category;
  }

  async createCategory(data) {
    return await CategoryRepository.create(data);
  }

  async updateCategory(id, data) {
    await this.getCategoryById(id); // Ensure it exists
    return await CategoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    await this.getCategoryById(id);
    return await CategoryRepository.delete(id);
  }
}

module.exports = new CategoryService();
