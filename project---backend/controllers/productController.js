const { Product, Sale, Customer, sequelize } = require('../models'); 
const { Op } = require('sequelize');


exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    let whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category) {
      whereClause.category = { [Op.like]: `%${category}%` };
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        products: rows,
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


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const stats = await Sale.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantitySold'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalSales'],
        [sequelize.fn('AVG', sequelize.col('quantity')), 'avgQuantityPerSale']
      ],
      where: { productId: id },
      raw: true
    });

    const recentSales = await Sale.findAll({
      where: { productId: id },
      include: [{ model: Customer, attributes: ['name', 'region', 'type'] }],
      order: [['saleDate', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        product,
        stats: {
          totalQuantitySold: Number(stats?.totalQuantitySold ?? 0),
          totalRevenue: Number(stats?.totalRevenue ?? 0),
          totalSales: Number(stats?.totalSales ?? 0),
          avgQuantityPerSale: Number(stats?.avgQuantityPerSale ?? 0)
        },
        recentSales
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'productCount']
      ],
      group: ['category'],
      order: [['category', 'ASC']]
    });

    res.json({
      success: true,
      data: categories.map(cat => ({
        category: cat.category,
        productCount: Number(cat.dataValues.productCount)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: 'Name, category, and price are required' });
    }
    if (price <= 0) return res.status(400).json({ error: 'Price must be greater than 0' });

    const product = await Product.create({ name, category, price, description });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, description } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (price !== undefined && price <= 0)
      return res.status(400).json({ error: 'Price must be greater than 0' });

    await product.update({
      name: name || product.name,
      category: category || product.category,
      price: price !== undefined ? price : product.price,
      description: description !== undefined ? description : product.description
    });

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const salesCount = await Sale.count({ where: { productId: id } });
    if (salesCount > 0) {
      return res.status(400).json({ error: 'Cannot delete product with existing sales records' });
    }

    await product.destroy();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};
