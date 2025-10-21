const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator.middleware');
const { protect } = require('../middleware/auth.middleware');
const {
  register,
  login,
  verifyTwoFactor,
  enableTwoFactor,
  confirmTwoFactor,
  getMe,
  logout
} = require('../controllers/auth.controller');

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['student', 'company', 'admin', 'coordinator'])
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/verify-2fa', verifyTwoFactor);
router.post('/enable-2fa', protect, enableTwoFactor);
router.post('/confirm-2fa', protect, confirmTwoFactor);
router.get('/me', protect, getMe);
router.post('/logout', logout);

module.exports = router;
