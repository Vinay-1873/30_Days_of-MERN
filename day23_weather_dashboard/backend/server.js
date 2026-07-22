// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const weatherRoutes = require('./routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const weatherRoutes = require('./routes/weatherRoutes');
app.use('/api/weather', weatherRoutes);


// Health check endpoint
app.get('/', (req, res) => {
    res.send('Weather API Server is running.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});