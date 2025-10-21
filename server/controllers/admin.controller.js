const User = require('../models/User.model');
const Student = require('../models/Student.model');
const Company = require('../models/Company.model');
const Job = require('../models/Job.model');
const Application = require('../models/Application.model');
const { generatePlacementReport } = require('../utils/pdfGenerator');
const logger = require('../utils/logger');
const path = require('path');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      data: users
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const { branch, batch, placementStatus, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (branch) query.branch = branch;
    if (batch) query.batch = batch;
    if (placementStatus) query.placementStatus = placementStatus;

    const students = await Student.find(query)
      .populate('user', 'email isActive')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      data: students
    });
  } catch (error) {
    logger.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const { isVerified, status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (isVerified !== undefined) query.isVerified = isVerified;
    if (status) query.status = status;

    const companies = await Company.find(query)
      .populate('user', 'email isActive')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Company.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      data: companies
    });
  } catch (error) {
    logger.error('Get all companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message
    });
  }
};

// Verify company
exports.verifyCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    company.isVerified = true;
    company.verifiedBy = req.user.id;
    company.verificationDate = new Date();
    company.status = 'approved';
    await company.save();

    res.status(200).json({
      success: true,
      message: 'Company verified successfully',
      data: company
    });
  } catch (error) {
    logger.error('Verify company error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying company',
      error: error.message
    });
  }
};

// Get placement statistics
exports.getPlacementStats = async (req, res) => {
  try {
    const { batch, branch } = req.query;
    
    // Total students
    const studentQuery = {};
    if (batch) studentQuery.batch = batch;
    if (branch) studentQuery.branch = branch;
    
    const totalStudents = await Student.countDocuments(studentQuery);
    const placedStudents = await Student.countDocuments({ ...studentQuery, placementStatus: 'placed' });
    
    // Branch-wise stats
    const branchWiseStats = await Student.aggregate([
      { $match: batch ? { batch } : {} },
      {
        $group: {
          _id: '$branch',
          total: { $sum: 1 },
          placed: {
            $sum: {
              $cond: [{ $eq: ['$placementStatus', 'placed'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          branch: '$_id',
          total: 1,
          placed: 1,
          percentage: {
            $multiply: [
              { $divide: ['$placed', '$total'] },
              100
            ]
          }
        }
      }
    ]);

    // Package statistics
    const packageStats = await Student.aggregate([
      { $match: { placementStatus: 'placed', placementPackage: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgPackage: { $avg: '$placementPackage' },
          maxPackage: { $max: '$placementPackage' },
          minPackage: { $min: '$placementPackage' }
        }
      }
    ]);

    // Top recruiters
    const topRecruiters = await Student.aggregate([
      { $match: { placementStatus: 'placed' } },
      {
        $group: {
          _id: '$placedCompany',
          hires: { $sum: 1 }
        }
      },
      { $sort: { hires: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: '_id',
          as: 'company'
        }
      },
      { $unwind: '$company' },
      {
        $project: {
          companyName: '$company.companyName',
          hires: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: {
          totalStudents,
          placedStudents,
          placementPercentage: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0
        },
        packageStats: packageStats[0] || {},
        branchWiseStats,
        topRecruiters
      }
    });
  } catch (error) {
    logger.error('Get placement stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching placement statistics',
      error: error.message
    });
  }
};

// Generate placement report
exports.generateReport = async (req, res) => {
  try {
    const { batch } = req.query;
    
    // Fetch data
    const studentQuery = batch ? { batch } : {};
    const totalStudents = await Student.countDocuments(studentQuery);
    const placedStudents = await Student.countDocuments({ ...studentQuery, placementStatus: 'placed' });
    
    const packageStats = await Student.aggregate([
      { $match: { placementStatus: 'placed', placementPackage: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgPackage: { $avg: '$placementPackage' },
          maxPackage: { $max: '$placementPackage' },
          minPackage: { $min: '$placementPackage' }
        }
      }
    ]);

    const reportData = {
      academicYear: batch || new Date().getFullYear(),
      totalStudents,
      placedStudents,
      placementPercentage: ((placedStudents / totalStudents) * 100).toFixed(2),
      averagePackage: packageStats[0]?.avgPackage?.toFixed(2) || 0,
      highestPackage: packageStats[0]?.maxPackage || 0,
      lowestPackage: packageStats[0]?.minPackage || 0
    };

    const reportPath = path.join(__dirname, '../uploads/reports', `placement-report-${Date.now()}.pdf`);
    await generatePlacementReport(reportData, reportPath);

    res.status(200).json({
      success: true,
      message: 'Report generated successfully',
      reportUrl: `/uploads/reports/${path.basename(reportPath)}`
    });
  } catch (error) {
    logger.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message
    });
  }
};

// Toggle user status
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    logger.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling user status',
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete associated profile
    if (user.role === 'student') {
      await Student.findOneAndDelete({ user: user._id });
    } else if (user.role === 'company') {
      await Company.findOneAndDelete({ user: user._id });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

module.exports = exports;
