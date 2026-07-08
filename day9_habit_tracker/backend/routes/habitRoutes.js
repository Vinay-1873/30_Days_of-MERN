const express = require('express');
const router = express.Router();
const { checkInHabit, createHabit,getAllHabits } = require('../controllers/habitController');

router.get('/', getAllHabits);
// POST /api/habits (Creates a new habit)
router.post('/', createHabit);
// POST /api/habits/:id/checkin 
router.post('/:id/checkin', checkInHabit);

module.exports = router;