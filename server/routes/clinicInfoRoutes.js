const express = require('express');
const { getClinicInfo, updateClinicInfo } = require('../controllers/clinicInfoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getClinicInfo);
router.put('/', protect, updateClinicInfo);

module.exports = router;
