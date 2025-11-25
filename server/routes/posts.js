const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Post = require('../models/Post');
const User = require('../models/User');

// Get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a post (with optional file/image)
router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        const { content, pollOptions } = req.body;

        const newPostObj = {
            user: req.user.id,
            content
        };

        if (req.file) {
            newPostObj.fileUrl = req.file.path;
            newPostObj.fileName = req.file.originalname;
            // Simple check to see if it's an image based on extension or mimetype if available
            if (req.file.mimetype && req.file.mimetype.startsWith('image')) {
                newPostObj.imageUrl = req.file.path;
            }
        }

        if (pollOptions) {
            // pollOptions might come as a stringified JSON if sent via FormData
            let options = [];
            try {
                options = typeof pollOptions === 'string' ? JSON.parse(pollOptions) : pollOptions;
            } catch (e) {
                options = [pollOptions]; // Fallback
            }

            if (Array.isArray(options) && options.length > 0) {
                newPostObj.poll = {
                    options: options.map(opt => ({ text: opt, votes: 0 })),
                    voters: []
                };
            }
        }

        const newPost = new Post(newPostObj);
        const post = await newPost.save();

        // Populate user details for immediate display
        await post.populate('user', 'username');

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Vote on a poll
router.post('/:id/vote', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.poll) {
            return res.status(400).json({ message: 'Post has no poll' });
        }

        // Check if already voted
        if (post.poll.voters.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already voted' });
        }

        const optionIndex = req.body.optionIndex;
        if (optionIndex < 0 || optionIndex >= post.poll.options.length) {
            return res.status(400).json({ message: 'Invalid option' });
        }

        post.poll.options[optionIndex].votes++;
        post.poll.voters.push(req.user.id);

        await post.save();
        res.json(post.poll);

    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
