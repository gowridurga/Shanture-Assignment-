const { AnalyticsReport, Sale, Product, Customer } = require('../models');
const { Op, fn, col } = require('sequelize');


const AnalyticsService = {
  getTotalRevenue: async (start, end) => {
    const result = await Sale.findOne({
      attributes: [
        [fn('SUM', col('totalAmount')), 'totalRevenue'],
        [fn('COUNT', col('id')), 'totalSales'],
      ],
      where: {
        saleDate: { [Op.between]: [start, end] }
      }
    });
    return result ? result.dataValues : { totalRevenue: 0, totalSales: 0 };
  },
  getTopProducts: async (start, end) => {
    const products = await Sale.findAll({
      attributes: ['productId', [fn('SUM', col('quantity')), 'totalSold']],
      where: { saleDate: { [Op.between]: [start, end] } },
      group: ['productId'],
      include: [{ model: Product, attributes: ['name', 'category'] }],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: 5
    });
    return products;
  },
  getTopCustomers: async (start, end) => {
    const customers = await Sale.findAll({
      attributes: ['customerId', [fn('SUM', col('totalAmount')), 'spent']],
      where: { saleDate: { [Op.between]: [start, end] } },
      group: ['customerId'],
      include: [{ model: Customer, attributes: ['name', 'email'] }],
      order: [[fn('SUM', col('totalAmount')), 'DESC']],
      limit: 5
    });
    return customers;
  },
  getRegionStats: async (start, end) => {
    const regions = await Sale.findAll({
      attributes: ['region', [fn('SUM', col('totalAmount')), 'revenue']],
      where: { saleDate: { [Op.between]: [start, end] } },
      group: ['region'],
      order: [[fn('SUM', col('totalAmount')), 'DESC']]
    });
    return regions;
  },
  getSalesTrend: async (start, end, interval = 'month') => {
   
    const sales = await Sale.findAll({
      attributes: [
        [fn('DATE', col('saleDate')), 'date'],
        [fn('SUM', col('totalAmount')), 'revenue']
      ],
      where: { saleDate: { [Op.between]: [start, end] } },
      group: [fn('DATE', col('saleDate'))],
      order: [[col('saleDate'), 'ASC']]
    });
    return sales;
  },
  generateAnalyticsReport: async (start, end) => {
    const overview = await AnalyticsService.getTotalRevenue(start, end);
    const topProducts = await AnalyticsService.getTopProducts(start, end);
    const topCustomers = await AnalyticsService.getTopCustomers(start, end);
    const regionStats = await AnalyticsService.getRegionStats(start, end);

    const report = await AnalyticsReport.create({
      reportDate: new Date(),
      startDate: start,
      endDate: end,
      totalRevenue: overview.totalRevenue,
      totalOrders: overview.totalSales,
      avgOrderValue: overview.totalRevenue / (overview.totalSales || 1),
      topProducts,
      topCustomers,
      regionStats
    });

    return report;
  }
};

exports.getDashboardOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const [
      revenueData,
      topProducts,
      topCustomers,
      regionStats,
      salesTrend
    ] = await Promise.all([
      AnalyticsService.getTotalRevenue(start, end),
      AnalyticsService.getTopProducts(start, end),
      AnalyticsService.getTopCustomers(start, end),
      AnalyticsService.getRegionStats(start, end),
      AnalyticsService.getSalesTrend(start, end, req.query.interval || 'month')
    ]);

    res.json({
      success: true,
      data: {
        overview: revenueData,
        topProducts,
        topCustomers,
        regionStats,
        salesTrend
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const report = await AnalyticsService.generateAnalyticsReport(
      new Date(startDate),
      new Date(endDate)
    );

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

exports.getSavedReports = async (req, res) => {
  try {
    const reports = await AnalyticsReport.findAll({
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit) || 10
    });

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await AnalyticsReport.findByPk(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

