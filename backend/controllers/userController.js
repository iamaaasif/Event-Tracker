const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Register new user
// @route /api/v1/user/register
// @acess Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;
  if (!username || !email || !password || !fullName) {
    throw createError(400, "Please add all fields!");
  }

  //check if user already exitst
  const userExists = await User.findOne({ email });
  if (userExists) {
    return createError(400, "User already exist");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = await User.create({
    username,
    fullName,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      token: genarateToken(user.id),
    });
  } else {
    return createError(400, "Invalid Data!");
  }
});

// @desc Authenticate a user
// @route POST /api/v1/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //check for email
  const user = await User.findOne({ email });
  console.log(user.password);
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      email: user.email,
      token: genarateToken(user.id),
    });
  } else {
    return createError(400, "Invalid Credentials!");
  }
});

// @desc get user data
// @route GET /api/v1/user/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

///generate JWT
const genarateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
