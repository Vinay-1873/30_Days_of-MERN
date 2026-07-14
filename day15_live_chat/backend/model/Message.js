// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatRoomId: {
        type: String, 
        required: true,
        index: true //  Indexing this is critical for fast querying of room history
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000 
    }
}, { 
    timestamps: true 
});

// Compound index to quickly fetch the most recent messages in a specific room
messageSchema.index({ chatRoomId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);