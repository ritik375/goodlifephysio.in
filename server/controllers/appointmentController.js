const AppointmentModel = require('../models/appointmentModel');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = asyncHandler(async (req, res) => {
  const {
    full_name,
    email,
    phone,
    service_id,
    doctor_id,
    preferred_date,
    preferred_time,
    message,
  } = req.body;

  const appointment = await AppointmentModel.create({
    full_name,
    email,
    phone,
    service_id,
    doctor_id,
    preferred_date,
    preferred_time,
    message,
  });

  // Send booking email
  try {
    await sendEmail(
      email,
      '📅 Appointment Request Received - MotionWell Physiotherapy',
      `
      <h2>Hello ${full_name},</h2>

      <p>Thank you for booking an appointment with <b>MotionWell Physiotherapy</b>.</p>

      <p>Your appointment request has been received successfully.</p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <td><b>Date</b></td>
          <td>${preferred_date}</td>
        </tr>
        <tr>
          <td><b>Time</b></td>
          <td>${preferred_time}</td>
        </tr>
      </table>

      <br>

      <p><b>Status:</b> Pending Confirmation</p>

      <p>Our team will contact you shortly.</p>

      <br>

      <h3>MotionWell Physiotherapy</h3>
      `
    );
  } catch (err) {
    console.error(err);
  }

  res.status(201).json({
    success: true,
    data: appointment,
    message: 'Appointment request received! Our team will contact you shortly to confirm.',
  });
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const appointments = await AppointmentModel.getAll({ status });

  res.json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const existing = await AppointmentModel.getById(req.params.id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found',
    });
  }

  const appointment = await AppointmentModel.updateStatus(req.params.id, status);

  try {
    let subject = '';
    let html = '';

    if (status === 'confirmed') {
      subject = '✅ Appointment Confirmed - MotionWell Physiotherapy';

      html = `
      <h2>Hello ${existing.full_name},</h2>

      <p>Your appointment has been <span style="color:green;"><b>CONFIRMED</b></span>.</p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <td><b>Date</b></td>
          <td>${existing.preferred_date}</td>
        </tr>

        <tr>
          <td><b>Time</b></td>
          <td>${existing.preferred_time}</td>
        </tr>
      </table>

      <br>

      <p>Please arrive 10 minutes before your appointment.</p>

      <br>

      <h3>MotionWell Physiotherapy</h3>
      `;
    }

    if (status === 'cancelled') {
      subject = '❌ Appointment Cancelled - MotionWell Physiotherapy';

      html = `
      <h2>Hello ${existing.full_name},</h2>

      <p>Your appointment has been <span style="color:red;"><b>CANCELLED</b></span>.</p>

      <p>Please visit our website to book another appointment.</p>

      <br>

      <h3>MotionWell Physiotherapy</h3>
      `;
    }

    if (subject) {
      await sendEmail(existing.email, subject, html);
    }
  } catch (err) {
    console.error(err);
  }

  res.json({
    success: true,
    data: appointment,
  });
});

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const existing = await AppointmentModel.getById(req.params.id);

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found',
    });
  }

  await AppointmentModel.remove(req.params.id);

  res.json({
    success: true,
    message: 'Appointment deleted successfully',
  });
});

// @desc    Dashboard Stats
// @route   GET /api/appointments/stats
// @access  Private
const getAppointmentStats = asyncHandler(async (req, res) => {
  const stats = await AppointmentModel.countByStatus();

  res.json({
    success: true,
    data: stats,
  });
});

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentStats,
};