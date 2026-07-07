require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// 1. The Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String,
        required: true,
         unique: true 
        },
  description: String
});
const Category = mongoose.model('Category', categorySchema);

// 2. The Item Schema (The Relational Link)
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  // Here is the magic: We store the Category's ID, and tell Mongoose which model it references
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', // This must exactly match the model name above
    required: true 
  }
});

const Item = mongoose.model('Item', itemSchema);

// --- POST: Create a Category ---
app.post('/api/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --- POST: Create an Item ---
app.post('/api/items', async (req, res) => {
  try {
    // req.body must include the 'category' ID you created in the step above
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Fetch all Categories (For the frontend dropdown)
app.get('/api/categories', async (req, res) => {
  try {
    // Find all categories in the database
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- GET: Fetch Items with .populate() ---
app.get('/api/items', async (req, res) => {
  try {
    // Without populate(): The 'category' field will just be a random string of characters (ObjectId)
    // With populate(): Mongoose runs a secondary query to fetch the full Category object
    const items = await Item.find().populate('category', 'name description -_id');
    
    // Notice the second argument in populate: 'name description -_id'
    // This tells Mongoose to ONLY return the name and description, and exclude the _id.
    
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`Inventory Server running on port ${PORT}`));