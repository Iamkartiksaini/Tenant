const express = require("express");
const {
  registerUser,
  loginUser,
  refresh,
  logout,
} = require("../controllers/userController");
const {
  registerValidationRules,
  validateUserBody,
  loginValidationRules,
} = require("../validations/auth.validations");
const userRoutes = express.Router();

userRoutes.post(
  "/register",
  registerValidationRules,
  validateUserBody,
  registerUser
);

userRoutes.post("/login", loginValidationRules, validateUserBody, loginUser);

userRoutes.post("/refresh", refresh);
userRoutes.post("/logout", logout);

module.exports = userRoutes;
