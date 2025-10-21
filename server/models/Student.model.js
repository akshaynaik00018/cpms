const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  phone: {
    type: String,
    required: true
  },
  alternatePhone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Social Links
  linkedIn: String,
  github: String,
  portfolio: String,
  
  // Academic Details
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true
  },
  branch: {
    type: String,
    required: true,
    enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  batch: {
    type: String,
    required: true // e.g., "2020-2024"
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },
  backlogs: {
    current: {
      type: Number,
      default: 0
    },
    history: {
      type: Number,
      default: 0
    }
  },
  
  // Education History
  tenthMarks: {
    percentage: Number,
    board: String,
    year: Number
  },
  twelfthMarks: {
    percentage: Number,
    board: String,
    year: Number
  },
  diplomaMarks: {
    percentage: Number,
    board: String,
    year: Number
  },
  
  // Skills and Portfolio
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    }
  }],
  certifications: [{
    title: String,
    issuedBy: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    startDate: Date,
    endDate: Date,
    projectUrl: String,
    githubUrl: String
  }],
  achievements: [{
    title: String,
    description: String,
    date: Date,
    organization: String
  }],
  
  // Platform Integrations
  platforms: {
    leetcode: {
      username: String,
      rating: Number,
      problemsSolved: Number
    },
    hackerrank: {
      username: String,
      rating: Number
    },
    codeforces: {
      username: String,
      rating: Number
    },
    coursera: {
      email: String,
      courses: Number
    }
  },
  
  // Resume
  resume: {
    filename: String,
    path: String,
    uploadDate: Date,
    parsedData: mongoose.Schema.Types.Mixed
  },
  
  // Placement Status
  placementStatus: {
    type: String,
    enum: ['unplaced', 'placed', 'higher_studies', 'not_interested'],
    default: 'unplaced'
  },
  placedCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  placementPackage: Number,
  placementDate: Date,
  
  // Preferences
  preferences: {
    jobRoles: [String],
    locations: [String],
    expectedPackage: Number,
    jobType: {
      type: String,
      enum: ['full-time', 'internship', 'both']
    }
  },
  
  // Activity
  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for profile completion percentage
studentSchema.virtual('profileCompletion').get(function() {
  let completed = 0;
  let total = 15;
  
  if (this.firstName && this.lastName) completed++;
  if (this.phone) completed++;
  if (this.dateOfBirth) completed++;
  if (this.address && this.address.city) completed++;
  if (this.linkedIn) completed++;
  if (this.github) completed++;
  if (this.cgpa) completed++;
  if (this.skills && this.skills.length > 0) completed++;
  if (this.resume && this.resume.path) completed++;
  if (this.tenthMarks && this.tenthMarks.percentage) completed++;
  if (this.twelfthMarks && this.twelfthMarks.percentage) completed++;
  if (this.projects && this.projects.length > 0) completed++;
  if (this.certifications && this.certifications.length > 0) completed++;
  if (this.preferences && this.preferences.jobRoles && this.preferences.jobRoles.length > 0) completed++;
  if (this.preferences && this.preferences.expectedPackage) completed++;
  
  return Math.round((completed / total) * 100);
});

// Index for searching
studentSchema.index({ enrollmentNumber: 1, branch: 1, batch: 1 });

module.exports = mongoose.model('Student', studentSchema);
