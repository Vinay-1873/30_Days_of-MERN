const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');


// Load environment variables immediately
dotenv.config();

// Initialize Database Connection
connectDB();

const app = express();

// --- Production Middleware ---
// Secure HTTP headers
app.use(helmet()); 
// Enable CORS for frontend integration
app.use(cors()); 
// Parse incoming JSON payloads
app.use(express.json()); 
// HTTP request logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Base Route ---
app.get('/', (req, res) => {
  res.status(200).json({ message: 'RBAC API is running.' });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});