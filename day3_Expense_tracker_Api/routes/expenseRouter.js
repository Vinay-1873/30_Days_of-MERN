const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, getCategorySummary } = require('../controllers/expenseController');


router.get('/summary', getCategorySummary);

// Standard CRUD Routes
router.route('/')
  .get(getExpenses)
  .post(addExpense);

module.exports = router;