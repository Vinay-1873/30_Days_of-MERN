const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    // 1. Verify the product actually exists before leaving a review
    const productExists = await Product.findById(req.body.product);
    if (!productExists) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // 2. Create the review
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.getProductAnalytics = async (req, res) => {
  try {
    const { productId } = req.params;

    // The Aggregation Pipeline
    const analytics = await Review.aggregate([
      // Stage 1: Filter reviews to ONLY match the requested productId
      // Note: We MUST cast the string to a MongoDB ObjectId for the match to work
      { 
        $match: { product: new mongoose.Types.ObjectId(productId) } 
      },
      // Stage 2: Group those matched reviews together
      {
        $group: {
          _id: '$product', // Group by the product ID
          averageRating: { $avg: '$rating' }, // Calculate math average
          totalReviews: { $sum: 1 } // Count how many documents passed through
        }
      }
    ]);

    // If no reviews exist yet, the pipeline returns an empty array
    if (analytics.length === 0) {
      return res.status(200).json({
        success: true,
        data: { averageRating: 0, totalReviews: 0, message: 'No reviews yet' }
      });
    }

    // Return the aggregated result (rounding the average to 1 decimal place)
    res.status(200).json({
      success: true,
      data: {
        averageRating: Math.round(analytics[0].averageRating * 10) / 10,
        totalReviews: analytics[0].totalReviews
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error processing analytics' });
  }
};