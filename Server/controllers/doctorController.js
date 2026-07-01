const User = require('../models/User');

/**
 * @desc    Get all doctors
 * @route   GET /api/doctors
 * @access  Private (Registered users only)
 */
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email specialization');
    
    return res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error('Get Doctors Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching doctors list',
      error: error.message,
    });
  }
};

module.exports = { getDoctors };
