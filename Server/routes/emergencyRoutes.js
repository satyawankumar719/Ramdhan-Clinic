const express = require('express');
const router = express.Router();
const {
  createEmergency,
  getEmergencies,
  getPatientEmergencies,
  updateEmergencyStatus
} = require('../controllers/emergencyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('patient'), createEmergency)
  .get(protect, getEmergencies);

router.get('/patient', protect, authorize('patient'), getPatientEmergencies);
router.put('/:id', protect, updateEmergencyStatus);

module.exports = router;
