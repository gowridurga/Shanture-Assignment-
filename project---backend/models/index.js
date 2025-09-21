const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  region: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('Individual', 'Business'), allowNull: false }
}, { tableName: 'customers', timestamps: true });

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  description: { type: DataTypes.TEXT }
}, { tableName: 'products', timestamps: true });

const Sale = sequelize.define('Sale', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Customer, key: 'id' } },
  productId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  saleDate: { type: DataTypes.DATE, allowNull: false },
  region: { type: DataTypes.STRING }
}, {
  tableName: 'sales',
  timestamps: true,
  hooks: {
    beforeCreate: (sale) => { sale.totalAmount = sale.quantity * sale.unitPrice; },
    beforeUpdate: (sale) => { sale.totalAmount = sale.quantity * sale.unitPrice; }
  }
});


const AnalyticsReport = sequelize.define('AnalyticsReport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reportDate: { type: DataTypes.DATE, allowNull: false },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
  totalRevenue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  avgOrderValue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  totalOrders: { type: DataTypes.INTEGER, defaultValue: 0 },
  topProducts: { type: DataTypes.JSONB },
  topCustomers: { type: DataTypes.JSONB },
  regionStats: { type: DataTypes.JSONB }
}, { tableName: 'analytics_reports', timestamps: true });


Customer.hasMany(Sale, { foreignKey: 'customerId', onDelete: 'CASCADE' });
Sale.belongsTo(Customer, { foreignKey: 'customerId' });

Product.hasMany(Sale, { foreignKey: 'productId', onDelete: 'CASCADE' });
Sale.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { sequelize, Customer, Product, Sale, AnalyticsReport };
