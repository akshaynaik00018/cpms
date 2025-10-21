const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  
  // Offer Details
  position: {
    type: String,
    required: true
  },
  
  offerType: {
    type: String,
    enum: ['full-time', 'internship', 'ppo', 'contract'],
    required: true
  },
  
  package: {
    ctc: {
      type: Number,
      required: true
    },
    baseSalary: Number,
    bonus: Number,
    stocks: Number,
    otherBenefits: String
  },
  
  joiningDate: Date,
  
  location: {
    city: String,
    state: String,
    country: String
  },
  
  // Bond Details
  bond: {
    required: {
      type: Boolean,
      default: false
    },
    duration: Number, // in months
    amount: Number,
    terms: String
  },
  
  // Offer Letter
  offerLetter: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  
  // Digital Signature
  signature: {
    studentSigned: {
      type: Boolean,
      default: false
    },
    studentSignedAt: Date,
    studentSignature: String, // base64 or path
    
    companySigned: {
      type: Boolean,
      default: false
    },
    companySignedAt: Date,
    companySignature: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired', 'withdrawn'],
    default: 'pending'
  },
  
  // Response
  studentResponse: {
    decision: {
      type: String,
      enum: ['accepted', 'declined']
    },
    respondedAt: Date,
    reason: String // If declined
  },
  
  // Validity
  validUntil: Date,
  
  // Additional Terms
  terms: [String],
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  verifiedAt: Date,
  
  // Notes
  notes: [{
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    note: String,
    date: Date
  }],
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Index
offerSchema.index({ student: 1, company: 1, status: 1 });

module.exports = mongoose.model('Offer', offerSchema);
