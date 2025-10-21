const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  content: {
    type: String,
    required: true
  },
  
  category: {
    type: String,
    enum: ['interview_experience', 'placement_tips', 'technical', 'aptitude', 'company_reviews', 'general', 'qa'],
    required: true
  },
  
  tags: [String],
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Company reference (if interview experience)
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  
  // Interview details
  interviewDetails: {
    role: String,
    year: Number,
    rounds: [{
      name: String,
      type: String,
      questions: [String],
      experience: String,
      tips: String
    }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    result: {
      type: String,
      enum: ['selected', 'rejected', 'in_process']
    }
  },
  
  // Engagement
  views: {
    type: Number,
    default: 0
  },
  
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Comments/Replies
  replies: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    downvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    edited: Boolean,
    editedAt: Date
  }],
  
  // Moderation
  isPinned: {
    type: Boolean,
    default: false
  },
  
  isLocked: {
    type: Boolean,
    default: false
  },
  
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted', 'flagged'],
    default: 'active'
  },
  
  flags: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    date: Date
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
  timestamps: true 
});

// Index for searching and filtering
forumSchema.index({ title: 'text', content: 'text', tags: 'text' });
forumSchema.index({ category: 1, createdAt: -1 });
forumSchema.index({ company: 1 });

module.exports = mongoose.model('Forum', forumSchema);
