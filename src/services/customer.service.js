const CustomerRepository = require('../repositories/customer.repository');
const { NotFoundError } = require('../utils/errors');

class CustomerService {
  async getAllCustomers() {
    return await CustomerRepository.findAll();
  }

  async getCustomerById(id) {
    const customer = await CustomerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async createCustomer(data) {
    return await CustomerRepository.create(data);
  }

  async updateCustomer(id, data) {
    await this.getCustomerById(id);
    return await CustomerRepository.update(id, data);
  }

  async deleteCustomer(id) {
    await this.getCustomerById(id);
    return await CustomerRepository.delete(id);
  }
}

module.exports = new CustomerService();
