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
// Middleware
// ---------------------------------------------------------------------

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
);


// ---------------------------------------------------------------------
// Rate Limiting
// ---------------------------------------------------------------------

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);


// ---------------------------------------------------------------------
// Static uploads
// ---------------------------------------------------------------------

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ---------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinic-info', clinicInfoRoutes);


// ---------------------------------------------------------------------
// Error Handling
// ---------------------------------------------------------------------

app.use(notFound);
app.use(errorHandler);


// ---------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await testConnection();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Physio Clinic API running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

start();

module.exports = app;