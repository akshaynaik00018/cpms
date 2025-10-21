const Student = require('../models/Student.model');
const User = require('../models/User.model');
const { parseResume } = require('../utils/resumeParser');
const logger = require('../utils/logger');

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('user', '-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    logger.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Update profile completion status
    const user = await User.findById(req.user.id);
    user.profileCompleted = student.profileCompletion >= 80;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: student
    });
  } catch (error) {
    logger.error('Update student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume'
      });
    }

    // Parse resume
    const parsedData = await parseResume(req.file.path);

    const student = await Student.findOne({ user: req.user.id });
    
    student.resume = {
      filename: req.file.filename,
      path: req.file.path,
      uploadDate: new Date(),
      parsedData: parsedData
    };

    // Auto-fill profile from parsed data
    if (parsedData) {
      if (parsedData.email && !student.user.email) {
        await User.findByIdAndUpdate(req.user.id, { email: parsedData.email });
      }
      if (parsedData.phone && !student.phone) {
        student.phone = parsedData.phone;
      }
      if (parsedData.skills && parsedData.skills.length > 0) {
        student.skills = parsedData.skills.map(skill => ({ name: skill, level: 'intermediate' }));
      }
      if (parsedData.cgpa && !student.cgpa) {
        student.cgpa = parsedData.cgpa;
      }
      if (parsedData.github && !student.github) {
        student.github = parsedData.github;
      }
      if (parsedData.linkedin && !student.linkedIn) {
        student.linkedIn = parsedData.linkedin;
      }
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      data: {
        resume: student.resume,
        parsedData: parsedData
      }
    });
  } catch (error) {
    logger.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
      error: error.message
    });
  }
};

// Add skill
exports.addSkill = async (req, res) => {
  try {
    const { name, level } = req.body;
    
    const student = await Student.findOne({ user: req.user.id });
    student.skills.push({ name, level });
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Skill added successfully',
      data: student.skills
    });
  } catch (error) {
    logger.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding skill',
      error: error.message
    });
  }
};

// Add project
exports.addProject = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    student.projects.push(req.body);
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Project added successfully',
      data: student.projects
    });
  } catch (error) {
    logger.error('Add project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding project',
      error: error.message
    });
  }
};

// Add certification
exports.addCertification = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    student.certifications.push(req.body);
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Certification added successfully',
      data: student.certifications
    });
  } catch (error) {
    logger.error('Add certification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding certification',
      error: error.message
    });
  }
};

// Get eligible jobs
exports.getEligibleJobs = async (req, res) => {
  try {
    const Job = require('../models/Job.model');
    const student = await Student.findOne({ user: req.user.id });
    
    const allJobs = await Job.find({ status: 'open' }).populate('company');
    const eligibleJobs = allJobs.filter(job => job.isStudentEligible(student));

    res.status(200).json({
      success: true,
      count: eligibleJobs.length,
      data: eligibleJobs
    });
  } catch (error) {
    logger.error('Get eligible jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching eligible jobs',
      error: error.message
    });
  }
};

// Get dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    const Application = require('../models/Application.model');
    const student = await Student.findOne({ user: req.user.id });
    
    const applications = await Application.find({ student: student._id })
      .populate('job')
      .sort({ appliedAt: -1 });

    const stats = {
      totalApplications: applications.length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      selected: applications.filter(app => app.status === 'selected').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      pending: applications.filter(app => app.status === 'applied').length
    };

    res.status(200).json({
      success: true,
      stats,
      recentApplications: applications.slice(0, 5),
      profileCompletion: student.profileCompletion
    });
  } catch (error) {
    logger.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard',
      error: error.message
    });
  }
};

module.exports = exports;
