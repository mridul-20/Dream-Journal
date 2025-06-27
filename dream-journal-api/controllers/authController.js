const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  console.log('Register request body:', req.body); // Log request body
  const { username, email, password } = req.body;

  // Check for required fields
  if (!username || !email || !password) {
    console.error('Missing required fields');
    return next(new ErrorResponse('Please provide username, email, and password', 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.error('Email already exists');
    return next(new ErrorResponse('email already exists', 400));
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password
  });

  // Generate token
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  console.log('Login request body:', req.body); // Log request body
  const { email, password } = req.body;

  // Validate email & password
  if (!email) {
    console.error('Email is required');
    return next(new ErrorResponse('Email is required', 400));
  }
  if (!password) {
    console.error('Password is required');
    return next(new ErrorResponse('Password is required', 400));
  }

  // Check for user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.error('Invalid credentials: user not found');
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    console.error('Invalid credentials: password mismatch');
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Generate token
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
});

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});