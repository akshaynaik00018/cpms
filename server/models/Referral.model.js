const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  isAlumni: {
    type: Boolean,
    default: false
  },
  
  alumniDetails: {
    graduationYear: Number,
    currentCompany: String,
    currentPosition: String
  },
  
  company: String,
  
  position: {
    type: String,
    required: true
  },
  
  description: String,
  
  requirements: [String],
  
  location: String,
  
  experienceRequired: {
    min: Number,
    max: Number
  },
  
  package: {
    min: Number,
    max: Number
  },
  
  applicationLink: String,
  
  contactEmail: String,
  
  type: {
    type: String,
    enum: ['job', 'internship', 'mentorship'],
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  expiryDate: Date,
  
  interestedStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    appliedAt: Date,
    status: {
      type: String,
      enum: ['interested', 'applied', 'shortlisted', 'selected', 'rejected']
    }
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Referral', referralSchema);
