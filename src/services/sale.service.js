const SaleRepository = require('../repositories/sale.repository');
const ProductRepository = require('../repositories/product.repository');
const { BusinessError, NotFoundError } = require('../utils/errors');
const db = require('../config/db');

class SaleService {
  async getAllSales(filters) {
    return await SaleRepository.findAll(filters);
  }

  async getSaleById(id) {
    const sale = await SaleRepository.findById(id);
    if (!sale) {
      throw new NotFoundError(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  async createSale(data) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      let subtotalTotal = 0;
      const items = [];

      for (const item of data.items) {
        // use client to query product to ensure isolation isn't broken
        const productRes = await client.query('SELECT * FROM productos WHERE id = $1 FOR UPDATE', [item.producto_id]);
        const product = productRes.rows[0];

        if (!product) {
          throw new NotFoundError(`Product with ID ${item.producto_id} not found`);
        }

        if (product.stock_actual < item.cantidad) {
          throw new BusinessError(`Not enough stock for product ${product.codigo}. Available: ${product.stock_actual}`);
        }

        const subtotalItem = product.precio_venta * item.cantidad;
        subtotalTotal += subtotalItem;

        items.push({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: product.precio_venta,
          subtotal: subtotalItem
        });

        // Deduct stock
        await client.query('UPDATE productos SET stock_actual = stock_actual - $1 WHERE id = $2', [item.cantidad, item.producto_id]);
      }

      const total = subtotalTotal - (data.descuento || 0);

      const saleData = {
        numero_comprobante: data.numero_comprobante,
        cliente_id: data.cliente_id,
        subtotal: subtotalTotal,
        descuento: data.descuento,
        total: total
      };

      const sale = await SaleRepository.create(saleData, items, client);

      await client.query('COMMIT');
      return await SaleRepository.findById(sale.id); // Get with details
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async cancelSale(id) {
    const sale = await this.getSaleById(id);
    
    if (sale.estado === 'anulada') {
      throw new BusinessError('Sale is already cancelled');
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Update state
      await SaleRepository.updateState(id, 'anulada', client);

      // Restore stock
      for (const item of sale.items) {
        await client.query('UPDATE productos SET stock_actual = stock_actual + $1 WHERE id = $2', [item.cantidad, item.producto_id]);
      }

      await client.query('COMMIT');
      return { message: 'Sale cancelled and stock restored successfully' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new SaleService();
