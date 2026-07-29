require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const { testConnection } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route modules
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const clinicInfoRoutes = require('./routes/clinicInfoRoutes');

const app = express();

// ---------------------------------------------------------------------
// Core middleware
// ---------------------------------------------------------------------
app.use(helmet({ crossOriginResourcePolicy: false })); // allow images to load cross-origin from client
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Basic rate limiting to slow down brute-force / spam on public endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------
app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinic-info', clinicInfoRoutes);

// ---------------------------------------------------------------------
// Error handling (must be last)
// ---------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Physio Clinic API running on http://localhost:${PORT}`);
  });
};

start();

module.exports = app;
