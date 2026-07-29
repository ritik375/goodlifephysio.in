const { validationResult } = require('express-validator');

// Runs after express-validator's chain of checks (e.g. body('email').isEmail()).
// If any validator failed, respond with a 422 and the list of field errors.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validate;
