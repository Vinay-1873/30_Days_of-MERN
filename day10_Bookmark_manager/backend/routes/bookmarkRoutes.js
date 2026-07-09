const express = require('express');
const router = express.Router();
const { getBookmarks, createBookmark } = require('../controllers/bookmarkController');

router.route('/')
  .get(getBookmarks)
  .post(createBookmark);

module.exports = router;