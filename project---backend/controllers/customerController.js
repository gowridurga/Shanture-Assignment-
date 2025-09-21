const { Customer, Sale, Product, sequelize } = require('../models');
const { Op } = require('sequelize');


exports.getAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = search ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { region: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await Customer.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        customers: rows,
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


exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [{
        model: Sale,
        limit: 10,
        order: [['saleDate', 'DESC']],
        include: [{ model: Product, attributes: ['name', 'category', 'price'] }]
      }]
    });

    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const stats = await Sale.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSpent'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalOrders'],
        [sequelize.fn('AVG', sequelize.col('totalAmount')), 'avgOrderValue']
      ],
      where: { customerId: id },
      raw: true
    });

    res.json({
      success: true,
      data: {
        customer,
        stats: {
          totalSpent: Number(stats?.totalSpent ?? 0),
          totalOrders: Number(stats?.totalOrders ?? 0),
          avgOrderValue: Number(stats?.avgOrderValue ?? 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.createCustomer = async (req, res) => {
  try {
    const { name, email, region, type } = req.body;
    if (!name || !email || !region || !type)
      return res.status(400).json({ error: 'All fields are required' });
    if (!['Individual', 'Business'].includes(type))
      return res.status(400).json({ error: 'Type must be Individual or Business' });

    const customer = await Customer.create({ name, email, region, type });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, region, type } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    if (type && !['Individual', 'Business'].includes(type)) {
      return res.status(400).json({ error: 'Type must be Individual or Business' });
    }

    await customer.update({
      name: name || customer.name,
      email: email || customer.email,
      region: region || customer.region,
      type: type || customer.type
    });

    res.json({ success: true, data: customer });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const salesCount = await Sale.count({ where: { customerId: id } });
    if (salesCount > 0) {
      return res.status(400).json({ error: 'Cannot delete customer with existing sales records' });
    }

    await customer.destroy();
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};
