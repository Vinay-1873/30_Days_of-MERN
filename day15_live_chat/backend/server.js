const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDB=require('./config/db')
const socketAuth = require('./middleware/socketAuth');
const chatHandler = require('./socketHandlers/chat');

const app = express();
connectDB();

// 1.standard HTTP server wrapping Express
const server = http.createServer(app);

// 2. Standard Express CORS for REST API routes
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
}));

// 3. Initializing Socket.io with strict CORS
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
});

// Force all sockets to pass through this middleware
io.use(socketAuth);

// 4. Listen for connections and pass them to our modular handler
io.on('connection', (socket) => {
    console.log(`🔌 New connection established: ${socket.id}`);
    
    // Passing the main 'io' instance and the specific 'socket' to our module
    chatHandler(io, socket);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Live Chat Server running on port ${PORT}`);
});