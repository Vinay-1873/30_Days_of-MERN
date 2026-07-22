const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');
const checkCache = require('../middleware/cacheMiddleware');
router.get('/:city', checkCache, getWeather);

module.exports = router;