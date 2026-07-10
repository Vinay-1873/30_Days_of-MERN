// /backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/dashboard/public
// @desc    Accessible to anyone
// @access  Public
router.get('/public', (req, res) => {
  res.status(200).json({ message: 'This is public data. Anyone can see this.' });
});

// @route   GET /api/dashboard/user
// @desc    Accessible to any logged-in user
// @access  Private (Requires Token)
router.get('/user', protect, (req, res) => {
  res.status(200).json({ 
    message: `Welcome to your dashboard, ${req.user.name}.`,
    role: req.user.role 
  });
});

// @route   GET /api/dashboard/admin
// @desc    Accessible ONLY to admins
// @access  Private/Admin (Requires Token + Admin Role)
router.get('/admin', protect, admin, (req, res) => {
  res.status(200).json({ 
    message: 'Welcome to the Admin Control Panel.',
    secretData: 'Top Secret Admin Stats' 
  });
});

module.exports = router;