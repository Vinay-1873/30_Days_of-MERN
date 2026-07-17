const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  }
});

const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [OptionSchema], // Embed the options within the poll
}, { timestamps: true });

module.exports = mongoose.model('Poll', PollSchema);