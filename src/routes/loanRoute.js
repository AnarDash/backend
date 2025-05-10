// backend/routes/loans.js
const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/addLoan/:userId', loanController.addLoan);
router.get('/:userId', loanController.getUserLoans);

module.exports = router;