const express = require('express');
const { body } = require('express-validator');
const {
  getGallery, createGalleryImage, updateGalleryImage, deleteGalleryImage,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getGallery);
router.post(
  '/',
  protect,
  upload.single('image'),
  [body('title').trim().notEmpty().withMessage('Title is required')],
  validate,
  createGalleryImage
);
router.put('/:id', protect, updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

module.exports = router;
