const express = require('express');
const router = express.Router();
const {
  getPatientPrescriptions,
  getDoctorPrescriptions,
  createPrescription,
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('patient'), getPatientPrescriptions)
  .post(protect, authorize('doctor'), createPrescription);
router.get('/doctor', protect, authorize('doctor'), getDoctorPrescriptions);

module.exports = router;
