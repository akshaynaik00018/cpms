const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    filename: String,
    path: String
  },
  about: {
    type: String,
    maxlength: 2000
  },
  industry: {
    type: String,
    required: true
  },
  companySize: {
    type: String,
    enum: ['1-50', '51-200', '201-500', '501-1000', '1000+']
  },
  website: {
    type: String,
    trim: true
  },
  
  // Contact Details
  contactPerson: {
    name: String,
    designation: String,
    email: String,
    phone: String
  },
  hrDetails: [{
    name: String,
    email: String,
    phone: String,
    designation: String
  }],
  
  // Company Address
  headquarters: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: Date,
  
  // Documents
  documents: [{
    name: String,
    type: String,
    path: String,
    uploadDate: Date
  }],
  
  // Company Stats
  stats: {
    totalJobsPosted: {
      type: Number,
      default: 0
    },
    totalHires: {
      type: Number,
      default: 0
    },
    averagePackage: Number
  },
  
  // Rating and Reviews
  rating: {
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    workCulture: {
      type: Number,
      default: 0
    },
    interviewProcess: {
      type: Number,
      default: 0
    },
    compensation: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
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

// Index for searching
companySchema.index({ companyName: 'text', industry: 'text' });

module.exports = mongoose.model('Company', companySchema);
