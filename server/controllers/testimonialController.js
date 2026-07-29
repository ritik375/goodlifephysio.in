const TestimonialModel = require('../models/testimonialModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get testimonials (public: approved only, admin: all)
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
  const approvedOnly = !req.admin;
  const testimonials = await TestimonialModel.getAll({ approvedOnly });
  res.json({ success: true, count: testimonials.length, data: testimonials });
});

// @desc    Submit a testimonial (goes live once admin approves)
// @route   POST /api/testimonials
// @access  Public
const createTestimonial = asyncHandler(async (req, res) => {
  const { patient_name, condition_treated, rating, message } = req.body;
  const testimonial = await TestimonialModel.create({ patient_name, condition_treated, rating, message });
  res.status(201).json({ success: true, data: testimonial, message: 'Thank you! Your review will appear after approval.' });
});

// @desc    Update a testimonial (approve/edit)
// @route   PUT /api/testimonials/:id
// @access  Private
const updateTestimonial = asyncHandler(async (req, res) => {
  const existing = await TestimonialModel.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }
  const { patient_name, condition_treated, rating, message, is_approved } = req.body;
  const testimonial = await TestimonialModel.update(req.params.id, {
    patient_name: patient_name ?? existing.patient_name,
    condition_treated: condition_treated ?? existing.condition_treated,
    rating: rating ?? existing.rating,
    message: message ?? existing.message,
    is_approved: is_approved ?? existing.is_approved,
  });
  res.json({ success: true, data: testimonial });
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
const deleteTestimonial = asyncHandler(async (req, res) => {
  const existing = await TestimonialModel.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }
  await TestimonialModel.remove(req.params.id);
  res.json({ success: true, message: 'Testimonial deleted successfully' });
});

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
