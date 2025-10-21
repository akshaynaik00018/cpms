const Student = require('../models/Student.model');
const Job = require('../models/Job.model');
const Application = require('../models/Application.model');
const Company = require('../models/Company.model');
const logger = require('../utils/logger');

// Placement prediction for a student
exports.placementPrediction = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Simple prediction model based on various factors
    let predictionScore = 0;
    let factors = [];

    // CGPA factor (40% weightage)
    const cgpaScore = (student.cgpa / 10) * 40;
    predictionScore += cgpaScore;
    factors.push({
      factor: 'CGPA',
      score: cgpaScore,
      maxScore: 40,
      percentage: ((cgpaScore / 40) * 100).toFixed(2)
    });

    // Skills factor (25% weightage)
    const skillsCount = student.skills.length;
    const skillsScore = Math.min((skillsCount / 10) * 25, 25);
    predictionScore += skillsScore;
    factors.push({
      factor: 'Skills',
      score: skillsScore,
      maxScore: 25,
      percentage: ((skillsScore / 25) * 100).toFixed(2)
    });

    // Projects factor (15% weightage)
    const projectsCount = student.projects.length;
    const projectsScore = Math.min((projectsCount / 5) * 15, 15);
    predictionScore += projectsScore;
    factors.push({
      factor: 'Projects',
      score: projectsScore,
      maxScore: 15,
      percentage: ((projectsScore / 15) * 100).toFixed(2)
    });

    // Certifications factor (10% weightage)
    const certsCount = student.certifications.length;
    const certsScore = Math.min((certsCount / 5) * 10, 10);
    predictionScore += certsScore;
    factors.push({
      factor: 'Certifications',
      score: certsScore,
      maxScore: 10,
      percentage: ((certsScore / 10) * 100).toFixed(2)
    });

    // No backlogs factor (10% weightage)
    const backlogsScore = student.backlogs.current === 0 ? 10 : 0;
    predictionScore += backlogsScore;
    factors.push({
      factor: 'No Active Backlogs',
      score: backlogsScore,
      maxScore: 10,
      percentage: ((backlogsScore / 10) * 100).toFixed(2)
    });

    const prediction = {
      overallScore: predictionScore.toFixed(2),
      percentage: predictionScore.toFixed(2),
      probability: predictionScore >= 70 ? 'High' : predictionScore >= 50 ? 'Medium' : 'Low',
      factors: factors,
      recommendations: []
    };

    // Generate recommendations
    if (student.cgpa < 7.0) {
      prediction.recommendations.push('Focus on improving your CGPA');
    }
    if (skillsCount < 5) {
      prediction.recommendations.push('Learn more in-demand skills');
    }
    if (projectsCount < 3) {
      prediction.recommendations.push('Build more projects to showcase your skills');
    }
    if (certsCount < 2) {
      prediction.recommendations.push('Obtain relevant certifications');
    }
    if (student.backlogs.current > 0) {
      prediction.recommendations.push('Clear your active backlogs');
    }

    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    logger.error('Placement prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating placement prediction',
      error: error.message
    });
  }
};

// Skill gap analysis
exports.skillGapAnalysis = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    
    // Get all active jobs
    const jobs = await Job.find({ status: 'open' });
    
    // Collect all required skills
    const allRequiredSkills = {};
    jobs.forEach(job => {
      job.requiredSkills.forEach(skill => {
        allRequiredSkills[skill] = (allRequiredSkills[skill] || 0) + 1;
      });
    });

    // Student's skills
    const studentSkills = student.skills.map(s => s.name);

    // Find gaps
    const missingSkills = [];
    const hasSkills = [];

    Object.entries(allRequiredSkills).forEach(([skill, count]) => {
      if (!studentSkills.includes(skill)) {
        missingSkills.push({ skill, demandCount: count });
      } else {
        hasSkills.push({ skill, demandCount: count });
      }
    });

    // Sort by demand
    missingSkills.sort((a, b) => b.demandCount - a.demandCount);
    hasSkills.sort((a, b) => b.demandCount - a.demandCount);

    // Generate recommendations
    const recommendations = missingSkills.slice(0, 5).map(s => ({
      skill: s.skill,
      priority: s.demandCount > 10 ? 'High' : s.demandCount > 5 ? 'Medium' : 'Low',
      demandCount: s.demandCount,
      suggestedCourses: [] // Can be enhanced with actual course recommendations
    }));

    res.status(200).json({
      success: true,
      data: {
        studentSkills: hasSkills,
        missingSkills: missingSkills.slice(0, 10),
        recommendations
      }
    });
  } catch (error) {
    logger.error('Skill gap analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing skill gap analysis',
      error: error.message
    });
  }
};

// Placement trends
exports.placementTrends = async (req, res) => {
  try {
    // Monthly placement trend
    const monthlyTrend = await Student.aggregate([
      {
        $match: { placementStatus: 'placed', placementDate: { $exists: true } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$placementDate' },
            month: { $month: '$placementDate' }
          },
          count: { $sum: 1 },
          avgPackage: { $avg: '$placementPackage' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Top hiring companies
    const topCompanies = await Student.aggregate([
      { $match: { placementStatus: 'placed' } },
      {
        $group: {
          _id: '$placedCompany',
          hires: { $sum: 1 },
          avgPackage: { $avg: '$placementPackage' }
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
      { $unwind: '$company' }
    ]);

    // Package distribution
    const packageDistribution = await Student.aggregate([
      { $match: { placementStatus: 'placed', placementPackage: { $exists: true } } },
      {
        $bucket: {
          groupBy: '$placementPackage',
          boundaries: [0, 3, 5, 7, 10, 15, 20, 100],
          default: '20+',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyTrend,
        topCompanies,
        packageDistribution
      }
    });
  } catch (error) {
    logger.error('Placement trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching placement trends',
      error: error.message
    });
  }
};

// Company analytics
exports.companyAnalytics = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Get all jobs by company
    const jobs = await Job.find({ company: companyId });
    const jobIds = jobs.map(j => j._id);

    // Application statistics
    const applicationStats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Average AI screening score
    const avgAIScore = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$aiScreening.score' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        company,
        totalJobs: jobs.length,
        applicationStats,
        avgAIScreeningScore: avgAIScore[0]?.avgScore || 0
      }
    });
  } catch (error) {
    logger.error('Company analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company analytics',
      error: error.message
    });
  }
};

module.exports = exports;
