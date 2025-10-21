const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const Internship = require('../models/Internship.model');
const logger = require('../utils/logger');

// Get all internships
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const internships = await Internship.find(query)
      .populate('company', 'companyName logo')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Internship.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      data: internships
    });
  } catch (error) {
    logger.error('Get internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching internships',
      error: error.message
    });
  }
});

// Protected routes
router.use(protect);

// Create internship (Company/Admin)
router.post('/', authorize('company', 'admin'), async (req, res) => {
  try {
    const Company = require('../models/Company.model');
    const company = await Company.findOne({ user: req.user.id });

    const internship = await Internship.create({
      ...req.body,
      company: company._id
    });

    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: internship
    });
  } catch (error) {
    logger.error('Create internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating internship',
      error: error.message
    });
  }
});

module.exports = router;
