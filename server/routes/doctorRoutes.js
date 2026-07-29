const express = require('express');
const { body } = require('express-validator');
const {
  getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor,
} = require('../controllers/doctorController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const doctorValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
];

router.get('/', optionalAuth, getDoctors);
router.get('/:id', getDoctorById);
router.post('/', protect, upload.single('photo'), doctorValidation, validate, createDoctor);
router.put('/:id', protect, upload.single('photo'), updateDoctor);
router.delete('/:id', protect, deleteDoctor);

module.exports = router;
