const PORT = process?.env?.PORT || 5000;
const MONGO_URI = process?.env?.MONGO_URI || null;

const ACCESS_TOKEN_CONFIG = {
  secret: process?.env?.ACCESS_TOKEN_SECRET || "ACCESS_TOKEN_SECRET ",
  expireIn: process?.env?.ACCESS_TOKEN_EXPIRE_IN || "30s",
};

const REFRESH_TOKEN_CONFIG = {
  secret: process?.env?.REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET ",
  expireIn: process?.env?.REFRESH_TOKEN_EXPIRE_IN || "7d",
};

const GEMINI_API_KEY = process.env?.GEMINI_API_KEY || "";

module.exports = {
  PORT,
  MONGO_URI,
  ACCESS_TOKEN_CONFIG,
  REFRESH_TOKEN_CONFIG,
  GEMINI_API_KEY,
};
