const express = require('express');
const router = express.Router();
const { createPoll, getPollById } = require('../controllers/pollController');

router.route('/')
  .post(createPoll);

router.route('/:id')
  .get(getPollById);

module.exports = router;