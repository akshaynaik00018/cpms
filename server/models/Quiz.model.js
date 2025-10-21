const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  
  description: String,
  
  category: {
    type: String,
    enum: ['aptitude', 'logical_reasoning', 'verbal', 'technical', 'coding', 'domain_specific'],
    required: true
  },
  
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  
  domain: String, // For domain-specific quizzes (e.g., 'JavaScript', 'Python', 'DSA')
  
  duration: {
    type: Number, // in minutes
    required: true
  },
  
  questions: [{
    question: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ['mcq', 'multiple_answer', 'true_false', 'coding'],
      default: 'mcq'
    },
    options: [String],
    correctAnswer: mongoose.Schema.Types.Mixed, // String for mcq, Array for multiple_answer, Boolean for true_false
    explanation: String,
    marks: {
      type: Number,
      default: 1
    },
    negativeMarks: {
      type: Number,
      default: 0
    },
    code: {
      language: String,
      template: String,
      testCases: [{
        input: String,
        expectedOutput: String
      }]
    }
  }],
  
  totalMarks: {
    type: Number,
    required: true
  },
  
  passingMarks: Number,
  
  // Quiz Settings
  settings: {
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    showResults: {
      type: Boolean,
      default: true
    },
    showAnswers: {
      type: Boolean,
      default: true
    },
    attemptsAllowed: {
      type: Number,
      default: 1
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  totalAttempts: {
    type: Number,
    default: 0
  },
  
  averageScore: {
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

const quizAttemptSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    marksObtained: Number,
    timeTaken: Number // in seconds
  }],
  
  score: {
    obtained: Number,
    total: Number,
    percentage: Number
  },
  
  timeTaken: Number, // Total time in seconds
  
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  
  startedAt: {
    type: Date,
    default: Date.now
  },
  
  completedAt: Date
}, { 
  timestamps: true 
});

// Index
quizAttemptSchema.index({ student: 1, quiz: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);
const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);

module.exports = { Quiz, QuizAttempt };
