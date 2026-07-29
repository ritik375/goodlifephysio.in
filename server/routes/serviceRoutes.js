const express = require('express');
const { body } = require('express-validator');
const {
  getServices, getServiceBySlug, createService, updateService, deleteService,
} = require('../controllers/serviceController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

const serviceValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('short_description').trim().notEmpty().withMessage('Short description is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

router.get('/', optionalAuth, getServices);
router.get('/:slug', getServiceBySlug);
router.post('/', protect, serviceValidation, validate, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
