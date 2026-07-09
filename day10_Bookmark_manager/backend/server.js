require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'DELETE']
}));

//Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1); 
  }
};
connectDB();

// Mounting Routers
// Any request starting with /api/bookmarks is handed off to the bookmarkRoutes file
app.use('/api/bookmarks', bookmarkRoutes);

// Server Init
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});