const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Verify Token & Attach User
const protect = async (req, res, next) => {
  let token;

  // Check if header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from the "Bearer <token>" string
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database and attach to req object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next middleware or controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 2. Role-Based Access Gatekeeper
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, allow access
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

module.exports = { protect, admin };