const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAdminAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route configurations
router.route('/')
  .post(protect, authorize('patient'), bookAppointment)
  .get(protect, authorize('admin'), getAdminAppointments);

router.get('/patient', protect, authorize('patient'), getPatientAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);

router.put('/:id', protect, updateAppointmentStatus);

module.exports = router;
