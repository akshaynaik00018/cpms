const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  applyForJob,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  withdrawApplication,
  getJobApplications
} = require('../controllers/application.controller');

router.use(protect);

// Student routes
router.post('/apply/:jobId', authorize('student'), applyForJob);
router.get('/my-applications', authorize('student'), getMyApplications);
router.put('/:id/withdraw', authorize('student'), withdrawApplication);

// Common routes
router.get('/:id', getApplication);

// Company/Admin routes
router.put('/:id/status', authorize('company', 'admin', 'coordinator'), updateApplicationStatus);
router.get('/job/:jobId', authorize('company', 'admin', 'coordinator'), getJobApplications);

module.exports = router;
