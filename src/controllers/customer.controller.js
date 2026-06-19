const CustomerService = require('../services/customer.service');

class CustomerController {
  async getAll(req, res, next) {
    try {
      const customers = await CustomerService.getAllCustomers();
      res.json({ success: true, data: customers });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id);
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const customer = await CustomerService.createCustomer(req.body);
      res.status(201).json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const customer = await CustomerService.updateCustomer(req.params.id, req.body);
      res.json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await CustomerService.deleteCustomer(req.params.id);
      res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CustomerController();
