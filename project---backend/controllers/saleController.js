const { Sale, Customer, Product, sequelize } = require('../models');
const { Op } = require('sequelize');


exports.getAllSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { startDate, endDate, customerId, productId, region } = req.query;

    let saleWhere = {};
    if (startDate && endDate) {
      saleWhere.saleDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    if (customerId) saleWhere.customerId = customerId;
    if (productId) saleWhere.productId = productId;

    const customerWhere = {};
    if (region) customerWhere.region = { [Op.like]: `%${region}%` };

    const { count, rows } = await Sale.findAndCountAll({
      where: saleWhere,
      include: [
        { model: Customer, attributes: ['name', 'email', 'region', 'type'], where: customerWhere },
        { model: Product, attributes: ['name', 'category', 'price'] }
      ],
      limit,
      offset,
      order: [['saleDate', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        sales: rows,
        pagination: {
          total: count,
          page,
          pages: Math.ceil(count / limit),
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByPk(id, {
      include: [
        { model: Customer, attributes: ['name', 'email', 'region', 'type'] },
        { model: Product, attributes: ['name', 'category', 'price', 'description'] }
      ]
    });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const { customerId, productId, quantity, unitPrice, saleDate, region } = req.body;

    if (!customerId || !productId || !quantity || !unitPrice || !saleDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (quantity <= 0 || unitPrice <= 0) {
      return res.status(400).json({ error: 'Quantity and unit price must be greater than 0' });
    }

    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(400).json({ error: 'Customer not found' });

    const product = await Product.findByPk(productId);
    if (!product) return res.status(400).json({ error: 'Product not found' });

    const sale = await Sale.create({
      customerId,
      productId,
      quantity,
      unitPrice,
      saleDate: new Date(saleDate),
      region: region || customer.region
    });

    const createdSale = await Sale.findByPk(sale.id, {
      include: [
        { model: Customer, attributes: ['name', 'email', 'region', 'type'] },
        { model: Product, attributes: ['name', 'category', 'price'] }
      ]
    });

    res.status(201).json({ success: true, data: createdSale });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId, productId, quantity, unitPrice, saleDate, region } = req.body;

    const sale = await Sale.findByPk(id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });

    if (customerId) {
      const customer = await Customer.findByPk(customerId);
      if (!customer) return res.status(400).json({ error: 'Customer not found' });
    }

    if (productId) {
      const product = await Product.findByPk(productId);
      if (!product) return res.status(400).json({ error: 'Product not found' });
    }

    if (quantity !== undefined && quantity <= 0)
      return res.status(400).json({ error: 'Quantity must be greater than 0' });

    if (unitPrice !== undefined && unitPrice <= 0)
      return res.status(400).json({ error: 'Unit price must be greater than 0' });

    await sale.update({
      customerId: customerId || sale.customerId,
      productId: productId || sale.productId,
      quantity: quantity !== undefined ? quantity : sale.quantity,
      unitPrice: unitPrice !== undefined ? unitPrice : sale.unitPrice,
      saleDate: saleDate ? new Date(saleDate) : sale.saleDate,
      region: region || sale.region
    });

    const updatedSale = await Sale.findByPk(id, {
      include: [
        { model: Customer, attributes: ['name', 'email', 'region', 'type'] },
        { model: Product, attributes: ['name', 'category', 'price'] }
      ]
    });

    res.json({ success: true, data: updatedSale });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByPk(id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });

    await sale.destroy();
    res.json({ success: true, message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.getSalesStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let whereClause = {};
    if (startDate && endDate) {
      whereClause.saleDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const stats = await Sale.findOne({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalSales'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalRevenue'],
        [sequelize.fn('AVG', sequelize.col('totalAmount')), 'avgSaleAmount'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity']
      ],
      where: whereClause,
      raw: true
    });

    const dailySales = await Sale.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('saleDate')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'salesCount'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      where: whereClause,
      group: [sequelize.fn('DATE', sequelize.col('saleDate'))],
      order: [[sequelize.fn('DATE', sequelize.col('saleDate')), 'DESC']],
      limit: 30,
      raw: true
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalSales: Number(stats.totalSales ?? 0),
          totalRevenue: Number(stats.totalRevenue ?? 0),
          avgSaleAmount: Number(stats.avgSaleAmount ?? 0),
          totalQuantity: Number(stats.totalQuantity ?? 0)
        },
        dailyTrend: dailySales.map(item => ({
          date: item.date,
          salesCount: Number(item.salesCount),
          revenue: Number(item.revenue)
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};
