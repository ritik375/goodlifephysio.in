const express = require('express');
const { body } = require('express-validator');
const {
  createAppointment, getAppointments, updateAppointmentStatus, deleteAppointment, getAppointmentStats,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const appointmentValidation = [
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('phone').trim().isLength({ min: 7 }).withMessage('A valid phone number is required'),
  body('preferred_date').isDate().withMessage('A valid preferred date is required'),
  body('preferred_time').trim().notEmpty().withMessage('Preferred time is required'),
];

router.post('/', appointmentValidation, validate, createAppointment);
router.get('/', protect, getAppointments);
router.get('/stats', protect, getAppointmentStats);
router.put(
  '/:id/status',
  protect,
  [body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status')],
  validate,
  updateAppointmentStatus
);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
