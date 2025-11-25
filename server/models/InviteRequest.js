const mongoose = require('mongoose');

const inviteRequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InviteRequest', inviteRequestSchema);
