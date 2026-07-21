const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];

const generateMockProducts = () => {
  const products = [];
  for (let i = 1; i <= 50; i++) {
    products.push({
      name: `Test Product ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.floor(Math.random() * 500) + 10, // Random price between 10 and 510
      inStock: Math.random() > 0.2 // 80% chance of being in stock
    });
  }
  return products;
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany();
    console.log('Previous products wiped.');

    const products = generateMockProducts();
    await Product.insertMany(products);
    
    console.log('50 Mock products inserted successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();