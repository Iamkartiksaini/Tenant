const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_CONFIG, REFRESH_TOKEN_CONFIG } = require("../utils/config");

function generateAccessToken({ _id, name, email }) {
  return jwt.sign({ user: { _id, name, email } }, ACCESS_TOKEN_CONFIG.secret, {
    expiresIn: ACCESS_TOKEN_CONFIG.expireIn,
    algorithm: "HS256",
  });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId }, REFRESH_TOKEN_CONFIG.secret, {
    expiresIn: REFRESH_TOKEN_CONFIG.expireIn,
    algorithm: "HS256",
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_CONFIG.secret, {}, function (err, decoded) {
    if (err) {
      throw new Error(err?.message);
    } else {
      return decoded;
    }
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_TOKEN_CONFIG.secret, {}, function (err, decoded) {
    if (err) {
      throw new Error(err?.message);
    } else {
      return decoded;
    }
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
