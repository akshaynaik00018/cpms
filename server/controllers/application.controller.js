const Application = require('../models/Application.model');
const Job = require('../models/Job.model');
const Student = require('../models/Student.model');
const Notification = require('../models/Notification.model');
const { analyzeSkillGap } = require('../utils/resumeParser');
const logger = require('../utils/logger');

// Apply for job
exports.applyForJob = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const job = await Job.findById(req.params.jobId).populate('company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Job is not accepting applications'
      });
    }

    // Check eligibility
    if (!job.isStudentEligible(student)) {
      return res.status(403).json({
        success: false,
        message: 'You are not eligible for this job'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: job._id,
      student: student._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // AI Screening
    const studentSkills = student.skills.map(s => s.name);
    const skillAnalysis = analyzeSkillGap(studentSkills, job.requiredSkills);

    const application = await Application.create({
      job: job._id,
      student: student._id,
      coverLetter: req.body.coverLetter,
      resume: student.resume,
      aiScreening: {
        score: skillAnalysis.matchPercentage,
        skillMatch: skillAnalysis.matchPercentage,
        educationMatch: student.cgpa >= job.eligibility.minCGPA ? 100 : 50,
        missingSkills: skillAnalysis.missingSkills,
        analyzedAt: new Date()
      },
      timeline: [{
        event: 'Application Submitted',
        description: 'Your application has been submitted successfully',
        date: new Date()
      }]
    });

    // Update job stats
    job.totalApplications += 1;
    await job.save();

    // Add to student's applied jobs
    student.appliedJobs.push(job._id);
    await student.save();

    // Create notification
    await Notification.create({
      recipient: req.user.id,
      type: 'application',
      title: 'Application Submitted',
      message: `Your application for ${job.title} at ${job.company.companyName} has been submitted`,
      relatedEntity: {
        entityType: 'Application',
        entityId: application._id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    logger.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying for job',
      error: error.message
    });
  }
};

// Get student applications
exports.getMyApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    
    const applications = await Application.find({ student: student._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'companyName logo' }
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    logger.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// Get application by ID
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('student')
      .populate({
        path: 'job',
        populate: { path: 'company' }
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    logger.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

// Update application status (Company/Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, round, feedback } = req.body;
    
    const application = await Application.findById(req.params.id)
      .populate('student')
      .populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;

    if (round) {
      application.rounds.push(round);
    }

    application.timeline.push({
      event: `Status Updated to ${status}`,
      description: feedback || `Application status changed to ${status}`,
      date: new Date()
    });

    await application.save();

    // Create notification for student
    await Notification.create({
      recipient: application.student.user,
      type: 'application',
      title: 'Application Status Updated',
      message: `Your application status has been updated to ${status}`,
      relatedEntity: {
        entityType: 'Application',
        entityId: application._id
      },
      priority: 'high'
    });

    // Update job stats
    if (status === 'shortlisted') {
      await Job.findByIdAndUpdate(application.job._id, {
        $inc: { shortlistedCount: 1 }
      });
    } else if (status === 'selected') {
      await Job.findByIdAndUpdate(application.job._id, {
        $inc: { selectedCount: 1 }
      });
      
      // Update student placement status
      await Student.findByIdAndUpdate(application.student._id, {
        placementStatus: 'placed',
        placedCompany: application.job.company,
        placementDate: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    logger.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
};

// Withdraw application
exports.withdrawApplication = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.student.toString() !== student._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.status = 'withdrawn';
    application.timeline.push({
      event: 'Application Withdrawn',
      description: 'Application was withdrawn by student',
      date: new Date()
    });
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    logger.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error withdrawing application',
      error: error.message
    });
  }
};

// Get applications for a job (Company/Admin)
exports.getJobApplications = async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = { job: req.params.jobId };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('student')
      .sort({ aiScreening: -1, appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    logger.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job applications',
      error: error.message
    });
  }
};

module.exports = exports;
