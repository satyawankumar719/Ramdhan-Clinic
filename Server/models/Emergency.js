const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    location: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    symptoms: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in-progress', 'resolved', 'cancelled'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Emergency = mongoose.model('Emergency', emergencySchema);

module.exports = Emergency;
