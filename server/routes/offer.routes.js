const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const Offer = require('../models/Offer.model');
const Student = require('../models/Student.model');
const logger = require('../utils/logger');

router.use(protect);

// Get student offers
router.get('/my-offers', authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    
    const offers = await Offer.find({ student: student._id })
      .populate('company', 'companyName logo')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    logger.error('Get student offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers',
      error: error.message
    });
  }
});

// Create offer (Company/Admin)
router.post('/', authorize('company', 'admin'), upload.single('offerLetter'), async (req, res) => {
  try {
    const offerData = {
      ...req.body,
      createdBy: req.user.id
    };

    if (req.file) {
      offerData.offerLetter = {
        filename: req.file.filename,
        path: req.file.path,
        uploadedAt: new Date()
      };
    }

    const offer = await Offer.create(offerData);

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (error) {
    logger.error('Create offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating offer',
      error: error.message
    });
  }
});

// Get offer by ID
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('student')
      .populate('company', 'companyName logo')
      .populate('job', 'title');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    logger.error('Get offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offer',
      error: error.message
    });
  }
});

// Respond to offer (Student)
router.put('/:id/respond', authorize('student'), async (req, res) => {
  try {
    const { decision, reason } = req.body;
    const student = await Student.findOne({ user: req.user.id });
    
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    if (offer.student.toString() !== student._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    offer.studentResponse = {
      decision,
      respondedAt: new Date(),
      reason: reason || ''
    };
    offer.status = decision;

    await offer.save();

    res.status(200).json({
      success: true,
      message: `Offer ${decision} successfully`,
      data: offer
    });
  } catch (error) {
    logger.error('Respond to offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error responding to offer',
      error: error.message
    });
  }
});

module.exports = router;
