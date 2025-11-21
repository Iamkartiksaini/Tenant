const { body, validationResult } = require("express-validator");

const nameValidation = body("name").notEmpty().withMessage("Name is required");

const emailValidation = body("email")
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email format")
  .matches(/@gmail\.com$/)
  .withMessage("Only Gmail addresses are allowed");

const passwordValidation = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 6, max: 20 })
  .withMessage("Password must be 6-20 characters long")
  .matches(/^[A-Z][A-Za-z0-9]{5,19}$/)
  .withMessage(
    "Password must start with an uppercase letter and contain only letters and numbers"
  );

const registerValidationRules = [
  nameValidation,
  emailValidation,
  passwordValidation,
];

const loginValidationRules = [
  emailValidation,
];

const validateUserBody = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstErrors = {};
    errors.array().forEach((err) => {
      if (!firstErrors[err.path]) {
        firstErrors[err.path] = err.msg;
      }
    });      

    return res.status(400).json({ errors: firstErrors });
  }
  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validateUserBody,
};
