const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const pollHandler = require('./sockets/pollHandler');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); 
app.use('/api/polls', require('./routes/pollRoutes'));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running normally' });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  pollHandler(io, socket);
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});