const http = require('http');
const app = require('./app');
const config = require('./config');
const { initSockets } = require('./sockets');

// Create HTTP server wrapping the Express app
const server = http.createServer(app);

// Initialize Socket.io
initSockets(server);

// Start listening
server.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
});