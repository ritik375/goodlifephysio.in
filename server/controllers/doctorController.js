const fs = require('fs');
const path = require('path');
const DoctorModel = require('../models/doctorModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const activeOnly = !req.admin;
  const doctors = await DoctorModel.getAll({ activeOnly });
  res.json({ success: true, count: doctors.length, data: doctors });
});

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await DoctorModel.getById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }
  res.json({ success: true, data: doctor });
});

// @desc    Create a doctor (with optional photo upload)
// @route   POST /api/doctors
// @access  Private
const createDoctor = asyncHandler(async (req, res) => {
  const { name, designation, specialization, experience_years, bio, email, phone, display_order } = req.body;
  const photo = req.file ? `doctors/${req.file.filename}` : null;

  const doctor = await DoctorModel.create({
    name, designation, specialization, experience_years, bio, photo, email, phone, display_order,
  });

  res.status(201).json({ success: true, data: doctor });
});

// @desc    Update a doctor
// @route   PUT /api/doctors/:id
// @access  Private
const updateDoctor = asyncHandler(async (req, res) => {
  const existing = await DoctorModel.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  const { name, designation, specialization, experience_years, bio, email, phone, display_order, is_active } = req.body;
  const photo = req.file ? `doctors/${req.file.filename}` : null;

  // If a new photo was uploaded, remove the old file from disk.
  if (photo && existing.photo) {
    const oldPath = path.join(__dirname, '..', 'uploads', existing.photo);
    fs.unlink(oldPath, () => {});
  }

  const doctor = await DoctorModel.update(req.params.id, {
    name: name ?? existing.name,
    designation: designation ?? existing.designation,
    specialization: specialization ?? existing.specialization,
    experience_years: experience_years ?? existing.experience_years,
    bio: bio ?? existing.bio,
    photo,
    email: email ?? existing.email,
    phone: phone ?? existing.phone,
    display_order: display_order ?? existing.display_order,
    is_active: is_active ?? existing.is_active,
  });

  res.json({ success: true, data: doctor });
});

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Private
const deleteDoctor = asyncHandler(async (req, res) => {
  const existing = await DoctorModel.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  if (existing.photo) {
    const filePath = path.join(__dirname, '..', 'uploads', existing.photo);
    fs.unlink(filePath, () => {});
  }

  await DoctorModel.remove(req.params.id);
  res.json({ success: true, message: 'Doctor deleted successfully' });
});

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
