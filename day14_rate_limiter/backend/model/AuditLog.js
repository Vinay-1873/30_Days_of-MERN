const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true,
    },
    endpointAttempted: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        default: 'Rate limit exceeded'
    }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);