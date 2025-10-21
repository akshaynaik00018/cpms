const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getCompanyJobs
} = require('../controllers/job.controller');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes
router.use(protect);

// Company routes
router.post('/', authorize('company', 'admin'), createJob);
router.put('/:id', authorize('company', 'admin'), updateJob);
router.delete('/:id', authorize('company', 'admin'), deleteJob);
router.get('/company/my-jobs', authorize('company'), getCompanyJobs);

module.exports = router;
