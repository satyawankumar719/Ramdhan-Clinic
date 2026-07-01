const Prescription = require('../models/Prescription');

/**
 * @desc    Get prescriptions for the logged-in patient
 * @route   GET /api/prescriptions
 * @access  Private (Patient only)
 */
const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate('doctor', 'name email specialization')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    console.error('Get Prescriptions Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching prescriptions',
      error: error.message,
    });
  }
};

/**
 * @desc    Get prescriptions for the logged-in doctor
 * @route   GET /api/prescriptions/doctor
 * @access  Private (Doctor only)
 */
const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.user._id })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    console.error('Get Doctor Prescriptions Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching prescriptions',
      error: error.message,
    });
  }
};

/**
 * @desc    Add a new prescription
 * @route   POST /api/prescriptions
 * @access  Private (Doctor only)
 */
const createPrescription = async (req, res) => {
  try {
    const { patient, medicines, notes } = req.body;

    if (!patient || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient and at least one medicine',
      });
    }

    const prescription = await Prescription.create({
      patient,
      doctor: req.user._id,
      medicines,
      notes,
    });

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization');

    return res.status(201).json({
      success: true,
      message: 'Prescription written successfully',
      data: populatedPrescription,
    });
  } catch (error) {
    console.error('Create Prescription Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error writing prescription',
      error: error.message,
    });
  }
};

module.exports = {
  getPatientPrescriptions,
  getDoctorPrescriptions,
  createPrescription,
};
