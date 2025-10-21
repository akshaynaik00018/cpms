const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const Drive = require('../models/Drive.model');
const logger = require('../utils/logger');

// Get all drives
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const drives = await Drive.find(query)
      .populate('company', 'companyName logo')
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: drives.length,
      data: drives
    });
  } catch (error) {
    logger.error('Get drives error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drives',
      error: error.message
    });
  }
});

// Get drive by ID
router.get('/:id', async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate('company')
      .populate('coordinator', 'email');

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found'
      });
    }

    res.status(200).json({
      success: true,
      data: drive
    });
  } catch (error) {
    logger.error('Get drive error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching drive',
      error: error.message
    });
  }
});

// Protected routes
router.use(protect);

// Create drive (Admin/Coordinator)
router.post('/', authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const drive = await Drive.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Drive created successfully',
      data: drive
    });
  } catch (error) {
    logger.error('Create drive error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating drive',
      error: error.message
    });
  }
});

// Update drive
router.put('/:id', authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Drive updated successfully',
      data: drive
    });
  } catch (error) {
    logger.error('Update drive error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating drive',
      error: error.message
    });
  }
});

// Register for drive (Student)
router.post('/:id/register', authorize('student'), async (req, res) => {
  try {
    const Student = require('../models/Student.model');
    const student = await Student.findOne({ user: req.user.id });
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found'
      });
    }

    if (drive.registeredStudents.includes(student._id)) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this drive'
      });
    }

    drive.registeredStudents.push(student._id);
    drive.stats.totalRegistrations += 1;
    await drive.save();

    res.status(200).json({
      success: true,
      message: 'Registered for drive successfully'
    });
  } catch (error) {
    logger.error('Register for drive error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for drive',
      error: error.message
    });
  }
});

module.exports = router;
