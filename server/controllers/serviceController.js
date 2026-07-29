const ServiceModel = require('../models/serviceModel');
const asyncHandler = require('../utils/asyncHandler');

// Turns "Sports Injury Rehab" into "sports-injury-rehab"
const slugify = (text) =>
  text.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// @desc    Get all services (public: active only, admin: all)
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const activeOnly = !req.admin;
  const services = await ServiceModel.getAll({ activeOnly });
  res.json({ success: true, count: services.length, data: services });
});

// @desc    Get single service by slug
// @route   GET /api/services/:slug
// @access  Public
const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await ServiceModel.getBySlug(req.params.slug);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  res.json({ success: true, data: service });
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private
const createService = asyncHandler(async (req, res) => {
  const { title, short_description, description, icon, duration_minutes, display_order } = req.body;
  const slug = slugify(title);

  const service = await ServiceModel.create({
    title, slug, short_description, description, icon, duration_minutes, display_order,
  });

  res.status(201).json({ success: true, data: service });
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
const updateService = asyncHandler(async (req, res) => {
  const existing = await ServiceModel.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }

  const { title, short_description, description, icon, duration_minutes, display_order, is_active } = req.body;
  const slug = title ? slugify(title) : existing.slug;

  const service = await ServiceModel.update(req.params.id, {
    title: title ?? existing.title,
    slug,
    short_description: short_description ?? existing.short_description,
    description: description ?? existing.description,
    icon: icon ?? existing.icon,
    duration_minutes: duration_minutes ?? existing.duration_minutes,
    display_order: display_order ?? existing.display_order,
    is_active: is_active ?? existing.is_active,
  });

  res.json({ success: true, data: service });
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = asyncHandler(async (req, res) => {
  const existing = await ServiceModel.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  await ServiceModel.remove(req.params.id);
  res.json({ success: true, message: 'Service deleted successfully' });
});

module.exports = { getServices, getServiceBySlug, createService, updateService, deleteService };
