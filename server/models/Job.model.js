const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Job Details
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'internship', 'contract', 'part-time'],
    required: true
  },
  
  // Package Details
  package: {
    min: {
      type: Number,
      required: true
    },
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // Location
  locations: [{
    city: String,
    state: String,
    country: String,
    isRemote: Boolean
  }],
  
  // Eligibility Criteria
  eligibility: {
    branches: [{
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER', 'ALL']
    }],
    minCGPA: {
      type: Number,
      default: 0
    },
    maxBacklogs: {
      type: Number,
      default: 0
    },
    allowHistoryBacklogs: {
      type: Boolean,
      default: false
    },
    batches: [String], // e.g., ["2024", "2025"]
    graduationYears: [Number],
    tenthMinPercentage: Number,
    twelfthMinPercentage: Number
  },
  
  // Required Skills
  requiredSkills: [String],
  preferredSkills: [String],
  
  // Selection Process
  selectionProcess: [{
    round: String,
    type: {
      type: String,
      enum: ['aptitude', 'technical', 'coding', 'group_discussion', 'hr', 'other']
    },
    description: String,
    duration: Number // in minutes
  }],
  
  // Job Responsibilities
  responsibilities: [String],
  
  // Benefits
  benefits: [String],
  
  // Application Details
  applicationDeadline: {
    type: Date,
    required: true
  },
  openings: {
    type: Number,
    default: 1
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'open', 'closed', 'cancelled'],
    default: 'draft'
  },
  
  // Applications
  totalApplications: {
    type: Number,
    default: 0
  },
  shortlistedCount: {
    type: Number,
    default: 0
  },
  selectedCount: {
    type: Number,
    default: 0
  },
  
  // Drive Association
  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive'
  },
  
  // Additional Info
  bond: {
    required: Boolean,
    duration: Number, // in months
    amount: Number
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Index for searching and filtering
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ status: 1, applicationDeadline: 1 });

// Method to check if student is eligible
jobSchema.methods.isStudentEligible = function(student) {
  // Check branch
  if (this.eligibility.branches.length > 0 && 
      !this.eligibility.branches.includes('ALL') &&
      !this.eligibility.branches.includes(student.branch)) {
    return false;
  }
  
  // Check CGPA
  if (student.cgpa < this.eligibility.minCGPA) {
    return false;
  }
  
  // Check backlogs
  if (student.backlogs.current > this.eligibility.maxBacklogs) {
    return false;
  }
  
  if (!this.eligibility.allowHistoryBacklogs && student.backlogs.history > 0) {
    return false;
  }
  
  // Check batch
  if (this.eligibility.batches.length > 0 && 
      !this.eligibility.batches.includes(student.batch)) {
    return false;
  }
  
  // Check 10th marks
  if (this.eligibility.tenthMinPercentage && 
      student.tenthMarks.percentage < this.eligibility.tenthMinPercentage) {
    return false;
  }
  
  // Check 12th marks
  if (this.eligibility.twelfthMinPercentage && 
      student.twelfthMarks.percentage < this.eligibility.twelfthMinPercentage) {
    return false;
  }
  
  return true;
};

module.exports = mongoose.model('Job', jobSchema);
