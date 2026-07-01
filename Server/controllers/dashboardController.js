const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Prescription = require('../models/Prescription');

/**
 * @desc    Get dashboard statistics based on user role
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;

    if (role === 'patient') {
      // Patient stats
      const upcomingCount = await Appointment.countDocuments({
        patient: userId,
        status: { $in: ['pending', 'confirmed'] },
      });

      const prescriptionCount = await Prescription.countDocuments({
        patient: userId,
      });

      return res.status(200).json({
        success: true,
        data: {
          upcoming: upcomingCount,
          prescriptions: prescriptionCount,
          healthScore: 85, // Mock value as health tracking is client-only
          avgWait: '2m 40s',
        },
      });
    } else if (role === 'doctor') {
      // Doctor stats
      const todayAppointmentsCount = await Appointment.countDocuments({
        doctor: userId,
        status: { $in: ['pending', 'confirmed'] },
      });

      // Find unique patient IDs for this doctor
      const uniquePatients = await Appointment.distinct('patient', { doctor: userId });
      const patientCount = uniquePatients.length;

      return res.status(200).json({
        success: true,
        data: {
          todayAppointments: todayAppointmentsCount,
          totalPatients: patientCount,
          emergencies: 1, // Mock value
          satisfaction: '4.9',
        },
      });
    } else if (role === 'admin') {
      // Admin stats
      const patientCount = await User.countDocuments({ role: 'patient' });
      const doctorCount = await User.countDocuments({ role: 'doctor' });
      const appointmentCount = await Appointment.countDocuments({});

      return res.status(200).json({
        success: true,
        data: {
          patients: patientCount,
          doctors: doctorCount,
          appointments: appointmentCount,
          emergencies: 2,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role',
      });
    }
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error generating dashboard statistics',
      error: error.message,
    });
  }
};

module.exports = { getDashboardStats };
