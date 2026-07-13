const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const AuditLog = require('./model/AuditLog'); 

const app = express();

connectDB();

app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev')); 

// Define the Rate Limiter with MongoDB Logging
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5, 
    standardHeaders: true, 
    legacyHeaders: false, 
    handler: async (req, res, next, options) => {
        // 1. Log the violation to MongoDB asynchronously
        try {
            await AuditLog.create({
                ipAddress: req.ip || req.connection.remoteAddress,
                endpointAttempted: req.originalUrl
            });
            console.log(`🚨 Security Alert: IP ${req.ip} exceeded rate limit.`);
        } catch (error) {
            console.error("Failed to log audit event:", error);
        }

        // 2. Send the 429 response back to the client
        res.status(options.statusCode).json({
            success: false,
            message: "Too many requests from this IP, please try again after a minute."
        });
    }
});

app.use('/api/', apiLimiter);

app.get('/api/data', (req, res) => {
    res.status(200).json({ success: true, message: "Secure data fetched successfully!" });
});

const PORT = process.env.PORT || 5000;

app.get('/api/admin/logs', async (req, res) => {
    try {
        // Fetch the 10 most recent security logs
        const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({ success: true, count: logs.length, logs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Database error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});