const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { registerValidationRules, validateUserBody, loginValidationRules } = require("../validations/auth.validations");
const userRoutes = express.Router();

userRoutes.post(
  "/register",
  registerValidationRules,
  validateUserBody,
  registerUser
);

userRoutes.post(
  "/login",
  loginValidationRules,
  validateUserBody,
  loginUser
);

module.exports = userRoutes;
