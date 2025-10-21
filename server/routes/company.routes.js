const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const Company = require('../models/Company.model');
const logger = require('../utils/logger');

router.use(protect);
router.use(authorize('company'));

// Get company profile
router.get('/profile', async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id }).populate('user', '-password');
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    logger.error('Get company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// Update company profile
router.put('/profile', async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: company
    });
  } catch (error) {
    logger.error('Update company profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Upload logo
router.post('/logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a logo'
      });
    }

    const company = await Company.findOne({ user: req.user.id });
    
    company.logo = {
      filename: req.file.filename,
      path: req.file.path
    };

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      data: company.logo
    });
  } catch (error) {
    logger.error('Upload logo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading logo',
      error: error.message
    });
  }
});

module.exports = router;
