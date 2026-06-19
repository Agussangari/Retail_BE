const SaleService = require('../services/sale.service');

class SaleController {
  async getAll(req, res, next) {
    try {
      const filters = {
        fecha: req.query.fecha,
        cliente_id: req.query.cliente_id
      };
      const sales = await SaleService.getAllSales(filters);
      res.json({ success: true, data: sales });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const sale = await SaleService.getSaleById(req.params.id);
      res.json({ success: true, data: sale });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const sale = await SaleService.createSale(req.body);
      res.status(201).json({ success: true, data: sale });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const result = await SaleService.cancelSale(req.params.id);
      res.json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SaleController();
