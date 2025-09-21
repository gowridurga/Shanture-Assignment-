const sequelize = require('./db');
const CustomerModel = require('./models/customer');
const ProductModel = require('./models/product');
const SaleModel = require('./models/sale');

const Customer = CustomerModel(sequelize);
const Product = ProductModel(sequelize);
const Sale = SaleModel(sequelize);

const sampleCustomers = [
  { name: 'John Doe', email: 'john@email.com', region: 'North', type: 'Individual' },
  { name: 'Jane Smith', email: 'jane@email.com', region: 'South', type: 'Business' },
  { name: 'Bob Johnson', email: 'bob@email.com', region: 'East', type: 'Individual' },
  { name: 'Alice Brown', email: 'alice@email.com', region: 'West', type: 'Business' },
  { name: 'Charlie Wilson', email: 'charlie@email.com', region: 'North', type: 'Individual' },
  { name: 'Diana Ross', email: 'diana@email.com', region: 'South', type: 'Business' },
  { name: 'Edward Norton', email: 'edward@email.com', region: 'East', type: 'Individual' },
  { name: 'Fiona Apple', email: 'fiona@email.com', region: 'West', type: 'Business' }
];

const sampleProducts = [
  { name: 'Laptop Pro', category: 'Electronics', price: 1299.99, description: 'High-performance laptop' },
  { name: 'Wireless Mouse', category: 'Electronics', price: 29.99, description: 'Bluetooth wireless mouse' },
  { name: 'Office Chair', category: 'Furniture', price: 199.99, description: 'Ergonomic office chair' },
  { name: 'Standing Desk', category: 'Furniture', price: 399.99, description: 'Height-adjustable desk' },
  { name: 'Monitor 4K', category: 'Electronics', price: 449.99, description: '27-inch 4K display' },
  { name: 'Keyboard Mechanical', category: 'Electronics', price: 129.99, description: 'RGB mechanical keyboard' },
  { name: 'Bookshelf', category: 'Furniture', price: 89.99, description: '5-shelf wooden bookcase' },
  { name: 'Table Lamp', category: 'Furniture', price: 39.99, description: 'LED desk lamp' },
  { name: 'Webcam HD', category: 'Electronics', price: 79.99, description: '1080p webcam' },
  { name: 'Headphones', category: 'Electronics', price: 159.99, description: 'Noise-canceling headphones' }
];

const regions = ['North', 'South', 'East', 'West'];

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const seedDatabase = async () => {
  try {
   
    await sequelize.sync({ force: true });
    console.log(' Database synced');

  
    const customers = await Customer.bulkCreate(sampleCustomers);
    console.log(`${customers.length} customers created`);

   
    const products = await Product.bulkCreate(sampleProducts);
    console.log(`${products.length} products created`);

   
    const sales = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);
    const endDate = new Date();

    for (let i = 0; i < 500; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice = parseFloat(product.price);
      const saleDate = randomDate(startDate, endDate);
      const region = regions[Math.floor(Math.random() * regions.length)];

      sales.push({
        customerId: customer.id,
        productId: product.id,
        quantity,
        unitPrice,
        totalAmount: quantity * unitPrice,
        saleDate,
        region
      });
    }

    await Sale.bulkCreate(sales);
    console.log(`${sales.length} sales records created`);

    console.log(' Database seeded successfully!');
  } catch (error) {
    console.error(' Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};


if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

