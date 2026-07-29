const express = require('express');
const { body } = require('express-validator');
const {
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const testimonialValidation = [
  body('patient_name').trim().notEmpty().withMessage('Name is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Review must be at least 10 characters'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

router.get('/', optionalAuth, getTestimonials);
router.post('/', testimonialValidation, validate, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
