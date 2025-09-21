const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Customer = require('./customer');
const Product = require('./product');

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  saleDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'sales',
  timestamps: true,
  hooks: {
    beforeSave: (sale) => {
      sale.totalAmount = sale.quantity * sale.unitPrice;
    }
  }
});