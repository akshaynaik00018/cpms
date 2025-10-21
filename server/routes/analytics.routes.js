const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  placementPrediction,
  skillGapAnalysis,
  placementTrends,
  companyAnalytics
} = require('../controllers/analytics.controller');

router.use(protect);

// Student routes
router.get('/prediction', authorize('student'), placementPrediction);
router.get('/skill-gap', authorize('student'), skillGapAnalysis);

// Admin routes
router.get('/trends', authorize('admin', 'coordinator'), placementTrends);
router.get('/company/:companyId', authorize('admin', 'coordinator'), companyAnalytics);

module.exports = router;
