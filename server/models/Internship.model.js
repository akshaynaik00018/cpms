const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  description: String,
  
  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['weeks', 'months']
    }
  },
  
  stipend: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    type: {
      type: String,
      enum: ['paid', 'unpaid', 'performance_based']
    }
  },
  
  locations: [{
    city: String,
    isRemote: Boolean
  }],
  
  startDate: Date,
  
  eligibility: {
    branches: [String],
    minCGPA: Number,
    semesters: [Number],
    batches: [String]
  },
  
  requiredSkills: [String],
  
  responsibilities: [String],
  
  learningOutcomes: [String],
  
  // PPO (Pre-Placement Offer)
  ppo: {
    available: {
      type: Boolean,
      default: false
    },
    criteria: String,
    package: Number
  },
  
  applicationDeadline: Date,
  
  openings: {
    type: Number,
    default: 1
  },
  
  status: {
    type: String,
    enum: ['open', 'closed', 'cancelled'],
    default: 'open'
  },
  
  totalApplications: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Internship', internshipSchema);
