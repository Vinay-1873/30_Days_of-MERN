require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const Document = require('./models/Document');
const connectDB = require('./config/db');

// 1. Initialize Express
const app = express();
app.use(cors());

// 2. Create the HTTP Server
const server = http.createServer(app);

// 3. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// 4.connect DB
connectDB();

const defaultValue = "";

// 5. Handle WebSocket Connections & Room Logic
io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on('get-document', async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    
    // Join the specific document room
    socket.join(documentId);
    
    // Send initial data to the client
    socket.emit('load-document', document.data);

    // Broadcast changes to others in the same room
    socket.on('send-changes', (delta) => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    // Save document state to MongoDB
    socket.on('save-document', async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// 6. MongoDB Helper Function
async function findOrCreateDocument(id) {
  if (id == null) return;
  
  const document = await Document.findById(id);
  if (document) return document;
  
  return await Document.create({ _id: id, data: defaultValue });
}

// 7. Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});