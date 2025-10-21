const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  driveName: {
    type: String,
    required: true
  },
  description: String,
  
  // Schedule
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  
  // Mode
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    required: true
  },
  
  venue: {
    name: String,
    address: String,
    room: String
  },
  
  onlineDetails: {
    platform: String,
    meetingLink: String,
    meetingId: String,
    password: String
  },
  
  // Rounds Schedule
  rounds: [{
    name: String,
    type: {
      type: String,
      enum: ['aptitude', 'technical', 'coding', 'group_discussion', 'hr', 'other']
    },
    date: Date,
    startTime: String,
    endTime: String,
    venue: String,
    onlineLink: String,
    duration: Number, // in minutes
    description: String
  }],
  
  // Eligibility
  eligibility: {
    branches: [String],
    minCGPA: Number,
    maxBacklogs: Number,
    batches: [String],
    graduationYears: [Number]
  },
  
  // Shortlisted Students
  shortlistedStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    shortlistedFor: String, // Round name
    shortlistedAt: Date
  }],
  
  // Selected Students
  selectedStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    position: String,
    package: Number,
    selectedAt: Date
  }],
  
  // Coordinator
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Status
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  
  // Registration
  registrationDeadline: Date,
  registeredStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  
  // Stats
  stats: {
    totalRegistrations: {
      type: Number,
      default: 0
    },
    totalShortlisted: {
      type: Number,
      default: 0
    },
    totalSelected: {
      type: Number,
      default: 0
    }
  },
  
  // Documents
  documents: [{
    name: String,
    type: String,
    path: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: Date
  }],
  
  // Notifications
  notifications: [{
    message: String,
    sentTo: {
      type: String,
      enum: ['all', 'registered', 'shortlisted', 'selected']
    },
    sentAt: Date
  }],
  
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

// Index for filtering
driveSchema.index({ status: 1, startDate: 1 });

module.exports = mongoose.model('Drive', driveSchema);
