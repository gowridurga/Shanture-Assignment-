const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  

const AnalyticsReport = sequelize.define('AnalyticsReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reportDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW   
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  totalRevenue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  avgOrderValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  topProducts: {
    type: DataTypes.JSON 
  },
  topCustomers: {
    type: DataTypes.JSON
  },
  regionStats: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'analytics_reports',
  timestamps: true
});

module.exports = AnalyticsReport;

