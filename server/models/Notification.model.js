const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  type: {
    type: String,
    enum: ['job', 'application', 'drive', 'message', 'announcement', 'reminder', 'system'],
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  message: {
    type: String,
    required: true
  },
  
  // Reference to related entity
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['Job', 'Application', 'Drive', 'Company', 'Student']
    },
    entityId: mongoose.Schema.Types.ObjectId
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Read status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Action link
  actionUrl: String,
  
  // Delivery channels
  channels: {
    web: {
      type: Boolean,
      default: true
    },
    email: {
      sent: Boolean,
      sentAt: Date
    },
    sms: {
      sent: Boolean,
      sentAt: Date
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // Auto-delete after 30 days
  }
}, { 
  timestamps: true 
});

// Index for querying
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
