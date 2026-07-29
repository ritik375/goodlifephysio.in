const ClinicInfoModel = require('../models/clinicInfoModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get clinic-wide info (address, hours, socials, map, etc.)
// @route   GET /api/clinic-info
// @access  Public
const getClinicInfo = asyncHandler(async (req, res) => {
  const info = await ClinicInfoModel.get();
  res.json({ success: true, data: info });
});

// @desc    Update clinic-wide info
// @route   PUT /api/clinic-info
// @access  Private
const updateClinicInfo = asyncHandler(async (req, res) => {
  const info = await ClinicInfoModel.update(req.body);
  res.json({ success: true, data: info });
});

module.exports = { getClinicInfo, updateClinicInfo };
