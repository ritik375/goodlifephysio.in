const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

/**
 * Protects admin-only routes.
 * Expects an "Authorization: Bearer <token>" header, verifies the JWT,
 * loads the admin record, and attaches it to req.admin.
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [rows] = await pool.query(
        'SELECT id, name, email FROM admins WHERE id = ?',
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Admin no longer exists' });
      }

      req.admin = rows[0];
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

/**
 * Optional auth — used on public GET routes that return extra data
 * (e.g. inactive services) when an admin is logged in, but work fine
 * for anonymous visitors too.
 */
const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer')) {
    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [rows] = await pool.query('SELECT id, name, email FROM admins WHERE id = ?', [decoded.id]);
      req.admin = rows[0] || null;
    } catch (error) {
      req.admin = null;
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
