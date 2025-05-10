// backend/controllers/loanController.js
const Loan = require('../models/loanModel');
const { body, validationResult } = require('express-validator');
const createHttpError = require('http-errors');

// Add a new loan
const addLoan = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('reason').isLength({ min: 5 }).withMessage('Reason must be at least 5 characters long'),
  body('dueDate').isDate().withMessage('Invalid due date'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, { errors: errors.array() }));
    }

    const { userId } = req.params; // Get userId from URL parameter
    const { amount, reason, dueDate } = req.body;

    try {
      const loan = await Loan.create({ user: userId, amount, reason, dueDate });
      res.status(201).json(loan);
    } catch (err) {
      next(createHttpError(500, `Loan creation failed: ${err.message}`));
    }
  },
];

// Get all unpaid loans for a specific user
const getUserLoans = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const loans = await Loan.find({ user: userId, isPaid: false }).populate('user', 'name');
    res.status(200).json(loans);
  } catch (err) {
    next(createHttpError(500, `Failed to fetch loans: ${err.message}`));
  }
};

module.exports = { addLoan, getUserLoans };