const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Build destination folder dynamically based on route (doctors vs gallery)
// so images stay organized on disk: uploads/doctors/, uploads/gallery/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subfolder = req.baseUrl.includes('doctors') ? 'doctors' : 'gallery';
    const dir = path.join(__dirname, '..', 'uploads', subfolder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    return cb(null, true);
  }
  cb(new Error('Only .jpeg, .jpg, .png and .webp image files are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
