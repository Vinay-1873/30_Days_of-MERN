const express = require('express');
const router = express.Router();
const Store = require('../models/Store');


router.get('/near', async (req, res) => {
  try {
    const { lng, lat, distance } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ success: false, error: 'Please provide longitude (lng) and latitude (lat).' });
    }


    const maxDistanceMeters = distance ? parseInt(distance, 10) : 10000;

    const stores = await Store.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: maxDistanceMeters,
        },
      },
    });

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json({ success: true, data: store });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;