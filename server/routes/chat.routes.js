const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Chat = require('../models/Chat.model');
const logger = require('../utils/logger');

router.use(protect);

// Get all chats for current user
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
      isActive: true
    })
    .populate('participants', 'email role')
    .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    logger.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chats',
      error: error.message
    });
  }
});

// Get chat by ID
router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'email role')
      .populate('messages.sender', 'email role');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat'
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    logger.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat',
      error: error.message
    });
  }
});

// Create or get chat
router.post('/create', async (req, res) => {
  try {
    const { participantId, chatType = 'individual' } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] },
      chatType: 'individual'
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, participantId],
        chatType,
        createdBy: req.user.id
      });
    }

    await chat.populate('participants', 'email role');

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    logger.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating chat',
      error: error.message
    });
  }
});

// Send message
router.post('/:id/message', async (req, res) => {
  try {
    const { content, messageType = 'text' } = req.body;
    
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const message = {
      sender: req.user.id,
      content,
      messageType,
      timestamp: new Date()
    };

    chat.messages.push(message);
    chat.lastMessage = {
      content,
      sender: req.user.id,
      timestamp: new Date()
    };

    await chat.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(req.params.id).emit('receive-message', {
      chatId: req.params.id,
      message
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

module.exports = router;
