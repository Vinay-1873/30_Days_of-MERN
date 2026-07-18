const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Store = require('./models/Store');


dotenv.config();


mongoose.connect(process.env.MONGO_URI);

const stores = JSON.parse(fs.readFileSync('./stores.json', 'utf-8'));

const importData = async () => {
  try {
    await Store.create(stores);
    console.log('Stores successfully imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Store.deleteMany();
    console.log('Stores successfully wiped!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}