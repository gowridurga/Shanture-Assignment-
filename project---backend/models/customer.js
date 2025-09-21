const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Individual', 'Business'), 
    allowNull: false,
  }
}, {
  tableName: 'customers', 
  timestamps: true        
});

module.exports = Customer;
