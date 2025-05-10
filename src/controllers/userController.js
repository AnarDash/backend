const User = require('../models/userModel');
const createHttpError = require('http-errors');
const { body, validationResult } = require('express-validator');

// Insecure in-memory storage for logged-in users (DO NOT USE IN PRODUCTION)
const loggedInUsers = {};

// Registration validation middleware (no changes needed)
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('role').isIn(['loader', 'renter']).withMessage('Invalid role'),
  body('address').notEmpty().withMessage('Address is required'),
];

// Register a new user (simplified - no token)
const register = [
  registerValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, { errors: errors.array() }));
    }

    const { name, email, password, role, address } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return next(createHttpError(409, 'User with this email already exists'));
      }

      const user = await User.create({ name, email, password, role, address });

      // Insecurely store user as logged in
      loggedInUsers[user._id.toString()] = { name: user.name, role: user.role };

      res.status(201).json({ message: 'User registered successfully', userId: user._id, name: user.name });
    } catch (err) {
      console.error('Error during registration:', err.message);
      next(createHttpError(500, `Server error during registration: ${err.message}`));
    }
  },
];

// Login validation middleware (no changes needed)
const loginValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// User login (simplified - no token)
const login = [
  loginValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Login validation errors:", errors.array());
      return next(createHttpError(400, { errors: errors.array() }));
    }

    const { name, password } = req.body;
    console.log("Login attempt for user:", name);

    try {
      const user = await User.findOne({ name });
      console.log("User found:", user);

      if (!user || !(await user.comparePassword(password))) {
        console.log("Invalid credentials for user:", name);
        return next(createHttpError(401, 'Invalid credentials'));
      }

      // Insecurely store user as logged in
      loggedInUsers[user._id.toString()] = { name: user.name, role: user.role };

      console.log("Login successful for user:", name);
      res.status(200).json({ message: 'Login successful', userId: user._id, name: user.name });
    } catch (err) {
      console.error("Error during login:", err);
      next(createHttpError(500, 'Server error during login'));
    }
  },
];

// Insecure middleware to check if userId is "logged in" (FOR DEVELOPMENT ONLY)
const checkLoggedIn = (req, res, next) => {
  const { userId } = req.params;
  console.log('checkLoggedIn middleware called for userId:', userId); // ADDED LOG
  console.log('loggedInUsers object:', loggedInUsers); // ADDED LOG
  if (loggedInUsers[userId]) {
    req.user = loggedInUsers[userId];
    console.log('User found in loggedInUsers:', loggedInUsers[userId]); // ADDED LOG
    next();
  } else {
    console.log('User NOT found in loggedInUsers'); // ADDED LOG
    return next(createHttpError(401, 'Not logged in'));
  }
};

module.exports = { register, login, checkLoggedIn };