// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const { Api_Erorr_Response, Api_Response } = require("./response-handler");

const JWT_SECRET = process?.env?.JWT_SECRET;
const JWT_TOKEN_EXPIRE_IN = process?.env?.JWT_TOKEN_EXPIRE_IN;

const { generateRefreshToken } = require("./token-handler");

const generateToken = ({ _id, name, email }) => {
  return jwt.sign({ user: { _id, name, email } }, JWT_SECRET, {
    expiresIn: "30s",
  });
};

// REGISTER USER ---------

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json(Api_Erorr_Response({ message: "User already exists" }));
  }
  try {
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const { _id, name, email } = user;
      const data = { _id, name, email };

      const refreshToken = generateRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();

      res.status(201).json(
        Api_Response({
          user: data,
          token: generateToken(data),
        })
      );
    } else {
      res
        .status(400)
        .json(Api_Erorr_Response({ message: "Invalid user data" }));
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// LOGIN USER ---------

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne(
    { email },
    { _id: 1, name: 1, email: 1, password: 1 }
  );

  if (user === null) {
    res.status(404).json(Api_Erorr_Response({ message: "User not found" }));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (user && isPasswordMatched) {
    const { _id, name, email } = user;
    const data = { _id, name, email };

    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json(
      Api_Response({
        user: data,
        token: generateToken(data),
        refreshToken,
      })
    );
  } else {
    res.status(404).json(Api_Erorr_Response({ message: "Incorrect Password" }));
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);

  const user = await User.findOne(
    { refreshToken },
    { _id: 1, name: 1, email: 1, password: 1 }
  );
  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const { _id, name, email } = user;
    const newAccessToken = generateToken({ _id, name, email });
    return res.status(201).json(Api_Response({ accessToken: newAccessToken }));
  });
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;

  await User.updateOne({ refreshToken }, { $set: { refreshToken: null } });

  res.sendStatus(204);
};

module.exports = {
  registerUser,
  loginUser,
  refresh,
  logout,
};
