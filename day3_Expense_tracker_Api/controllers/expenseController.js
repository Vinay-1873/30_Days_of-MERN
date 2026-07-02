const Expense = require('../models/Expense');

// Getting all expenses 
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 }); // Sort by newest first
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Added a new expense
const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// this get's total expenses grouped by category
const getCategorySummary = async (req, res) => {
  try {
    // The Aggregation Pipeline is an array of operations to pass the data through
    const summary = await Expense.aggregate([
      {
        // Grouped the documents together based on their 'category' field
        $group: {
          _id: '$category', 
          // For every document in that group, sum up the 'amount' field
          totalAmount: { $sum: '$amount' },
          // Count how many transactions are in this category
          transactionCount: { $sum: 1 } 
        }
      },
      {
        // Sort the final results from highest spender to lowest
        $sort: { totalAmount: -1 }
      }
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  getCategorySummary
};