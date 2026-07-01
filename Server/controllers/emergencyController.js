const Emergency = require('../models/Emergency');
const User = require('../models/User');

// @desc    Create new emergency request
// @route   POST /api/emergency
// @access  Private (Patient)
exports.createEmergency = async (req, res) => {
  try {
    const { location, phone, symptoms } = req.body;

    // Find available doctor (prioritize available)
    const doctors = await User.find({ role: 'doctor' });
    const assignedDoctor = doctors.length > 0 ? doctors[0] : null;

    const emergency = await Emergency.create({
      patient: req.user._id,
      location,
      phone,
      symptoms,
      assignedDoctor: assignedDoctor ? assignedDoctor._id : null,
      status: assignedDoctor ? 'assigned' : 'pending'
    });

    // Populate patient and doctor info
    const populatedEmergency = await Emergency.findById(emergency._id)
      .populate('patient', 'name email')
      .populate('assignedDoctor', 'name specialization');

    res.status(201).json({
      success: true,
      message: assignedDoctor ? 'Emergency request sent and doctor assigned!' : 'Emergency request sent, waiting for doctor availability',
      data: populatedEmergency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create emergency request',
      error: error.message
    });
  }
};

// @desc    Get all emergencies (Admin/Doctor)
// @route   GET /api/emergency
// @access  Private
exports.getEmergencies = async (req, res) => {
  try {
    let query = {};
    
    // Doctors only see their assigned emergencies
    if (req.user.role === 'doctor') {
      query.assignedDoctor = req.user._id;
    }

    const emergencies = await Emergency.find(query)
      .populate('patient', 'name email')
      .populate('assignedDoctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: emergencies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergencies',
      error: error.message
    });
  }
};

// @desc    Get patient's own emergencies
// @route   GET /api/emergency/patient
// @access  Private
exports.getPatientEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find({ patient: req.user._id })
      .populate('assignedDoctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: emergencies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your emergencies',
      error: error.message
    });
  }
};

// @desc    Update emergency status
// @route   PUT /api/emergency/:id
// @access  Private
exports.updateEmergencyStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const emergency = await Emergency.findById(req.params.id);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    // Update status and notes
    emergency.status = status;
    if (notes) emergency.notes = notes;
    await emergency.save();

    const updatedEmergency = await Emergency.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('assignedDoctor', 'name specialization');

    res.status(200).json({
      success: true,
      message: 'Emergency status updated',
      data: updatedEmergency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update emergency',
      error: error.message
    });
  }
};
