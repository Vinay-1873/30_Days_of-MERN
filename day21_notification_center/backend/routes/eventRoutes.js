const express = require('express');
const { triggerNotification } = require('../controllers/eventController.js');

const router = express.Router();

router.post('/trigger', triggerNotification);

module.exports = router;