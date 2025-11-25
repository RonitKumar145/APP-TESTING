const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String
    },
    fileUrl: {
        type: String
    },
    fileName: {
        type: String
    },
    poll: {
        question: String,
        options: [{
            text: String,
            votes: { type: Number, default: 0 }
        }],
        voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);
