const express = require('express');
const cors = require('cors');
const config = require('./config');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Middleware
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);

// Basic health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running.' });
});

module.exports = app;