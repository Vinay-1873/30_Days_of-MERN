const express = require('express');
const router = express.Router();
const { checkInHabit, createHabit } = require('../controllers/habitController');

// POST /api/habits (Creates a new habit)
router.post('/', createHabit);
// POST /api/habits/:id/checkin 
router.post('/:id/checkin', checkInHabit);

module.exports = router;