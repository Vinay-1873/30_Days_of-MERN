// middlewares/socketAuth.js
const jwt = require('jsonwebtoken');

const socketAuth = (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        const err = new Error("Authentication error: No token provided");
        err.data = { type: "AUTH_ERROR" }; 
        return next(err); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next(); 
    } catch (error) {
        const err = new Error("Authentication error: Invalid token");
        return next(err);
    }
};

module.exports = socketAuth;