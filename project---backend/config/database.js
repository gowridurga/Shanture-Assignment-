const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(' PostgreSQL connected successfully');

   
    await sequelize.sync({ alter: true }); 
    console.log(' Database synchronized');
  } catch (error) {
    console.error(' Unable to connect to database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
