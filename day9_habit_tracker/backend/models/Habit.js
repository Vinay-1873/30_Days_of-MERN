const mongoose = require('mongoose')

const habitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    lastCheckInDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);