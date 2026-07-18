const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a store name'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Please add a physical address'],
  },
  // GeoJSON Point format
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    // Remember: [longitude, latitude] format
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

StoreSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Store', StoreSchema);