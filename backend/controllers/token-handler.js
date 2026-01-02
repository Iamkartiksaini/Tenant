const jwt = require("jsonwebtoken");

function generateAccessToken(userId) {
  return jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" }
  );
}

function generateRefreshToken(userId) {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
