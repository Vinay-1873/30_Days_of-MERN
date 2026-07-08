const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const habitRoutes = require('./routes/habitRoutes');

// Load environment variables
dotenv.config();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON bodies

// Wire up the routes we just built
app.use('/api/habits', habitRoutes);

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Atlas Connected...');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

// Initialize server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});