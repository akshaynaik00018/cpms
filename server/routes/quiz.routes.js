const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { Quiz, QuizAttempt } = require('../models/Quiz.model');
const Student = require('../models/Student.model');
const logger = require('../utils/logger');

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const quizzes = await Quiz.find(query)
      .select('-questions.correctAnswer')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    logger.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quizzes',
      error: error.message
    });
  }
});

// Protected routes
router.use(protect);

// Create quiz (Admin)
router.post('/', authorize('admin', 'coordinator'), async (req, res) => {
  try {
    const quiz = await Quiz.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    logger.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating quiz',
      error: error.message
    });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.correctAnswer');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    logger.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz',
      error: error.message
    });
  }
});

// Start quiz attempt
router.post('/:id/attempt', authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check attempts
    const previousAttempts = await QuizAttempt.countDocuments({
      quiz: quiz._id,
      student: student._id
    });

    if (previousAttempts >= quiz.settings.attemptsAllowed) {
      return res.status(403).json({
        success: false,
        message: 'Maximum attempts reached'
      });
    }

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: student._id,
      answers: []
    });

    res.status(201).json({
      success: true,
      message: 'Quiz attempt started',
      data: {
        attemptId: attempt._id,
        quiz: quiz
      }
    });
  } catch (error) {
    logger.error('Start quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting quiz attempt',
      error: error.message
    });
  }
});

// Submit quiz
router.post('/attempt/:attemptId/submit', authorize('student'), async (req, res) => {
  try {
    const { answers } = req.body;
    const attempt = await QuizAttempt.findById(req.params.attemptId)
      .populate('quiz');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    const quiz = attempt.quiz;
    let totalScore = 0;

    // Evaluate answers
    attempt.answers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = JSON.stringify(answer.answer) === JSON.stringify(question.correctAnswer);
      const marksObtained = isCorrect ? question.marks : -question.negativeMarks;
      totalScore += marksObtained;

      return {
        questionId: question._id,
        answer: answer.answer,
        isCorrect,
        marksObtained,
        timeTaken: answer.timeTaken
      };
    });

    attempt.score = {
      obtained: totalScore,
      total: quiz.totalMarks,
      percentage: (totalScore / quiz.totalMarks) * 100
    };
    attempt.status = 'completed';
    attempt.completedAt = new Date();
    attempt.timeTaken = req.body.timeTaken;

    await attempt.save();

    // Update quiz stats
    quiz.totalAttempts += 1;
    quiz.averageScore = ((quiz.averageScore * (quiz.totalAttempts - 1)) + attempt.score.percentage) / quiz.totalAttempts;
    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: attempt
    });
  } catch (error) {
    logger.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz',
      error: error.message
    });
  }
});

// Get student quiz history
router.get('/my-attempts', authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    
    const attempts = await QuizAttempt.find({ student: student._id })
      .populate('quiz', 'title category difficulty')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    logger.error('Get quiz attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz attempts',
      error: error.message
    });
  }
});

module.exports = router;
