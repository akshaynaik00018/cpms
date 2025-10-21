const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const {
  getProfile,
  updateProfile,
  uploadResume,
  addSkill,
  addProject,
  addCertification,
  getEligibleJobs,
  getDashboard
} = require('../controllers/student.controller');

// All routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume', upload.single('resume'), uploadResume);
router.post('/skills', addSkill);
router.post('/projects', addProject);
router.post('/certifications', addCertification);
router.get('/eligible-jobs', getEligibleJobs);
router.get('/dashboard', getDashboard);

module.exports = router;
