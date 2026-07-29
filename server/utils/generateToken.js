const jwt = require('jsonwebtoken');

/**
 * Sign a JWT for an admin session.
 * @param {number} id - admin's database id
 * @returns {string} signed JWT, expires per JWT_EXPIRES_IN (default 7d)
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
