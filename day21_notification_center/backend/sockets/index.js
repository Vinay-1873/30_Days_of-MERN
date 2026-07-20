const { Server } = require('socket.io');
const config = require('../config');
let io;
const initSockets = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: config.clientUrl,
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};
const getIo = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized!');
    }
    return io;
};
module.exports = { initSockets, getIo };