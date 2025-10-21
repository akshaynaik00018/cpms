const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Forum = require('../models/Forum.model');
const logger = require('../utils/logger');

// Get all forum posts
router.get('/', async (req, res) => {
  try {
    const { category, company, search, page = 1, limit = 20 } = req.query;
    
    const query = { status: 'active' };
    if (category) query.category = category;
    if (company) query.company = company;
    if (search) query.$text = { $search: search };

    const posts = await Forum.find(query)
      .populate('author', 'email role')
      .populate('company', 'companyName')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Forum.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      data: posts
    });
  } catch (error) {
    logger.error('Get forum posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forum posts',
      error: error.message
    });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id)
      .populate('author', 'email role')
      .populate('company', 'companyName')
      .populate('replies.author', 'email role');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    logger.error('Get forum post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forum post',
      error: error.message
    });
  }
});

// Protected routes
router.use(protect);

// Create forum post
router.post('/', async (req, res) => {
  try {
    const post = await Forum.create({
      ...req.body,
      author: req.user.id
    });

    await post.populate('author', 'email role');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    logger.error('Create forum post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
});

// Add reply
router.post('/:id/reply', async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'This post is locked'
      });
    }

    post.replies.push({
      author: req.user.id,
      content: req.body.content
    });

    await post.save();
    await post.populate('replies.author', 'email role');

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: post.replies[post.replies.length - 1]
    });
  } catch (error) {
    logger.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding reply',
      error: error.message
    });
  }
});

// Upvote post
router.post('/:id/upvote', async (req, res) => {
  try {
    const post = await Forum.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Remove from downvotes if exists
    post.downvotes = post.downvotes.filter(id => id.toString() !== req.user.id);

    // Toggle upvote
    const upvoteIndex = post.upvotes.findIndex(id => id.toString() === req.user.id);
    if (upvoteIndex > -1) {
      post.upvotes.splice(upvoteIndex, 1);
    } else {
      post.upvotes.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Vote recorded',
      upvotes: post.upvotes.length,
      downvotes: post.downvotes.length
    });
  } catch (error) {
    logger.error('Upvote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording vote',
      error: error.message
    });
  }
});

module.exports = router;
