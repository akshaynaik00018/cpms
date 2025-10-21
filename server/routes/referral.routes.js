const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Referral = require('../models/Referral.model');
const logger = require('../utils/logger');

// Get all referrals
router.get('/', async (req, res) => {
  try {
    const { type, isActive, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const referrals = await Referral.find(query)
      .populate('postedBy', 'email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Referral.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      data: referrals
    });
  } catch (error) {
    logger.error('Get referrals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching referrals',
      error: error.message
    });
  }
});

// Protected routes
router.use(protect);

// Create referral
router.post('/', async (req, res) => {
  try {
    const referral = await Referral.create({
      ...req.body,
      postedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Referral posted successfully',
      data: referral
    });
  } catch (error) {
    logger.error('Create referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating referral',
      error: error.message
    });
  }
});

// Show interest in referral
router.post('/:id/interested', async (req, res) => {
  try {
    const Student = require('../models/Student.model');
    const student = await Student.findOne({ user: req.user.id });

    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Referral not found'
      });
    }

    const alreadyInterested = referral.interestedStudents.some(
      s => s.student.toString() === student._id.toString()
    );

    if (alreadyInterested) {
      return res.status(400).json({
        success: false,
        message: 'Already showed interest in this referral'
      });
    }

    referral.interestedStudents.push({
      student: student._id,
      appliedAt: new Date(),
      status: 'interested'
    });

    await referral.save();

    res.status(200).json({
      success: true,
      message: 'Interest recorded successfully'
    });
  } catch (error) {
    logger.error('Show interest error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording interest',
      error: error.message
    });
  }
});

module.exports = router;
