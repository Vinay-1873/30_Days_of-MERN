const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Review title is required'],
      maxlength: 100,
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      required: [true, 'Review rating is required'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
      index: true, // Crucial for aggregation performance
    },
  },
  {
    timestamps: true,
  }
);

// Prevent users from leaving more than one review per product (Optional but good for production)
// reviewSchema.index({ product: 1, user: 1 }, { unique: true }); 

module.exports = mongoose.model('Review', reviewSchema);