const fs = require('fs');
const path = require('path');
const GalleryModel = require('../models/galleryModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
const getGallery = asyncHandler(async (req, res) => {
  const images = await GalleryModel.getAll();
  res.json({ success: true, count: images.length, data: images });
});

// @desc    Upload a new gallery image
// @route   POST /api/gallery
// @access  Private
const createGalleryImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'An image file is required' });
  }

  const { title, category, display_order } = req.body;
  const image = `gallery/${req.file.filename}`;

  const item = await GalleryModel.create({ title, category, image, display_order });
  res.status(201).json({ success: true, data: item });
});

// @desc    Update gallery item details (title/category/order)
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryImage = asyncHandler(async (req, res) => {
  const existing = await GalleryModel.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Gallery image not found' });
  }
  const { title, category, display_order } = req.body;
  const item = await GalleryModel.update(req.params.id, {
    title: title ?? existing.title,
    category: category ?? existing.category,
    display_order: display_order ?? existing.display_order,
  });
  res.json({ success: true, data: item });
});

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const existing = await GalleryModel.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Gallery image not found' });
  }

  // Only delete the physical file if it's an uploaded one (not seed data).
  if (existing.image && !existing.image.startsWith('seed/')) {
    const filePath = path.join(__dirname, '..', 'uploads', existing.image);
    fs.unlink(filePath, () => {});
  }

  await GalleryModel.remove(req.params.id);
  res.json({ success: true, message: 'Gallery image deleted successfully' });
});

module.exports = { getGallery, createGalleryImage, updateGalleryImage, deleteGalleryImage };
