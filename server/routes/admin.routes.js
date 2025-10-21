const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getAllUsers,
  getAllStudents,
  getAllCompanies,
  verifyCompany,
  getPlacementStats,
  generateReport,
  toggleUserStatus,
  deleteUser
} = require('../controllers/admin.controller');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/students', getAllStudents);
router.get('/companies', getAllCompanies);
router.put('/companies/:id/verify', verifyCompany);
router.get('/placement-stats', getPlacementStats);
router.get('/generate-report', generateReport);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
