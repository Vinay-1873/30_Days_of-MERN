const mongoose = require('mongoose');

const bookmarkSchema =new mongoose.Schema({
    title: { 
      type: String, 
      required: [true, 'Bookmark title is required'],
      trim: true 
    },
    url: { 
      type: String, 
      required: [true, 'Bookmark URL is required'],
      trim: true
    },
    tags: { 
      type: [String], 
      default: [],
      index: true 
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('Bookmark', bookmarkSchema);