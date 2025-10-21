const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected', 'selected', 'offer_accepted', 'offer_declined', 'withdrawn'],
    default: 'applied'
  },
  
  // Resume submitted with application
  resume: {
    filename: String,
    path: String
  },
  
  // Cover Letter
  coverLetter: String,
  
  // Round-wise Progress
  rounds: [{
    roundName: String,
    roundType: String,
    status: {
      type: String,
      enum: ['pending', 'cleared', 'failed', 'skipped']
    },
    score: Number,
    feedback: String,
    date: Date,
    remarks: String
  }],
  
  currentRound: {
    type: Number,
    default: 0
  },
  
  // AI Screening Results
  aiScreening: {
    score: Number,
    skillMatch: Number,
    experienceMatch: Number,
    educationMatch: Number,
    recommendations: [String],
    missingSkills: [String],
    analyzedAt: Date
  },
  
  // Interview Schedule
  interviews: [{
    round: String,
    date: Date,
    time: String,
    venue: String,
    mode: {
      type: String,
      enum: ['online', 'offline']
    },
    meetingLink: String,
    interviewer: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled']
    }
  }],
  
  // Offer Details (if selected)
  offer: {
    letterPath: String,
    package: Number,
    joiningDate: Date,
    position: String,
    location: String,
    bond: {
      duration: Number,
      amount: Number
    },
    acceptedAt: Date,
    declinedAt: Date,
    declineReason: String
  },
  
  // Notes by admin/coordinator
  notes: [{
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Timeline
  timeline: [{
    event: String,
    description: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
  appliedAt: {
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

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

// Index for querying
applicationSchema.index({ status: 1, appliedAt: -1 });

// Add timeline entry before saving
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      event: 'Status Updated',
      description: `Application status changed to ${this.status}`,
      date: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
