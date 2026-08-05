const bcrypt = require('bcryptjs');
const AdminModel = require('../models/adminModel');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Login admin and return JWT
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("========== LOGIN REQUEST ==========");
  console.log("Email:", email);
  console.log("Password:", password);

  const admin = await AdminModel.findByEmail(email);

  console.log("Admin Found:", admin);

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  
  
  const isMatch = await bcrypt.compare(password, admin.password);

  console.log("Password Match:", isMatch);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  res.json({
    success: true,
    data: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin.id),
    },
  });
});

// @desc    Get currently logged-in admin's profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.admin,
  });
});

// @desc    Change admin password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await AdminModel.findByEmail(req.admin.email);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  const isMatch = await bcrypt.compare(currentPassword, admin.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await AdminModel.updatePassword(admin.id, hashedPassword);

  res.json({
    success: true,
    message: "Password updated successfully",
  });
});

module.exports = {
  loginAdmin,
  getProfile,
  changePassword,
};
