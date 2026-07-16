const express = require('express');
const router = express.Router();

// Importing the controller functions
const { 
  createProduct, 
  createReview, 
  getProductAnalytics 
} = require('../controllers/reviewController');

// Product Routes
router.post('/products', createProduct);
router.get('/products/:productId/analytics', getProductAnalytics);

// Review Routes
router.post('/reviews', createReview);

module.exports = router;