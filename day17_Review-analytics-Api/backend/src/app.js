const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const reviewRoutes = require('./routes/reviewRoutes');

// Initialize express
const app = express();

// Global Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON payloads
app.use(morgan('dev')); // Log requests

// Basic health check route
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running optimally.' });
});

// We will mount our analytics routes here next...
app.use('/api', reviewRoutes);

module.exports = app;