const Appointment = require('../models/Appointment');
const User = require('../models/User');

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments
 * @access  Private (Patient only)
 */
const bookAppointment = async (req, res) => {
  try {
    const { doctor, date, reason, mode, spec, phone } = req.body;

    // Validate inputs
    if (!doctor || !date || !reason || !spec || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (doctor, date, reason, spec, phone)',
      });
    }

    // Check if the doctor exists and is indeed a doctor
    const doctorUser = await User.findById(doctor);
    if (!doctorUser || doctorUser.role !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      phone,
      date,
      reason,
      mode: mode || 'Video',
      spec,
      status: 'pending', // All bookings start as pending
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Book Appointment Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error booking appointment',
      error: error.message,
    });
  }
};

/**
 * @desc    Get logged in patient's appointments
 * @route   GET /api/appointments/patient
 * @access  Private (Patient only)
 */
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name email specialization')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Get Patient Appointments Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching patient appointments',
      error: error.message,
    });
  }
};

/**
 * @desc    Get logged in doctor's appointments
 * @route   GET /api/appointments/doctor
 * @access  Private (Doctor only)
 */
const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Get Doctor Appointments Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching doctor appointments',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all appointments (Admin overview)
 * @route   GET /api/appointments
 * @access  Private (Admin only)
 */
const getAdminAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Get Admin Appointments Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching all appointments',
      error: error.message,
    });
  }
};

/**
 * @desc    Update appointment status (confirm, cancel, complete)
 * @route   PUT /api/appointments/:id
 * @access  Private
 */
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Authorization checks:
    // - Doctor can confirm, complete, or cancel their own appointments
    // - Patient can cancel their own appointments
    // - Admin can update any
    const isDoctor = req.user.role === 'doctor' && req.user._id.toString() === appointment.doctor.toString();
    const isPatient = req.user.role === 'patient' && req.user._id.toString() === appointment.patient.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isDoctor && !isPatient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this appointment status',
      });
    }

    // Patients can only cancel their appointments
    if (isPatient && status !== 'cancelled') {
      return res.status(403).json({
        success: false,
        message: 'Patients can only cancel appointments',
      });
    }

    appointment.status = status;
    await appointment.save();

    // Populate user references before returning
    const updatedAppointment = await Appointment.findById(appointmentId)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialization');

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: updatedAppointment,
    });
  } catch (error) {
    console.error('Update Appointment Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error updating appointment status',
      error: error.message,
    });
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAdminAppointments,
  updateAppointmentStatus,
};
