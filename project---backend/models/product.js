const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'products',   
  timestamps: true        
});

module.exports = Product;
