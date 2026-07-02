const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please specify the appointment date and time'],
    },
    reason: {
      type: String,
      required: [true, 'Please specify the reason for consultation'],
    },
    mode: {
      type: String,
      enum: ['Video', 'In-clinic'],
      default: 'Video',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    spec: {
      type: String,
      required: [true, 'Please specify the medical specialty'],
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
