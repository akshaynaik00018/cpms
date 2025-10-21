const Job = require('../models/Job.model');
const Company = require('../models/Company.model');
const logger = require('../utils/logger');

// Create job
exports.createJob = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    if (!company.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Company must be verified to post jobs'
      });
    }

    const job = await Job.create({
      ...req.body,
      company: company._id,
      createdBy: req.user.id
    });

    company.stats.totalJobsPosted += 1;
    await company.save();

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    logger.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const { 
      status, 
      jobType, 
      branch, 
      minPackage, 
      maxPackage,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (jobType) query.jobType = jobType;
    if (branch) query['eligibility.branches'] = branch;
    if (minPackage) query['package.min'] = { $gte: minPackage };
    if (maxPackage) query['package.max'] = { $lte: maxPackage };
    if (search) {
      query.$text = { $search: search };
    }

    const jobs = await Job.find(query)
      .populate('company', 'companyName logo')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: jobs
    });
  } catch (error) {
    logger.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

// Get job by ID
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('drive');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    logger.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership or admin
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    logger.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership or admin
    if (job.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    logger.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

// Get company jobs
exports.getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    
    const jobs = await Job.find({ company: company._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    logger.error('Get company jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company jobs',
      error: error.message
    });
  }
};

module.exports = exports;
