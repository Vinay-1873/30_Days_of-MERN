const Bookmark = require('../models/Bookmark');

// @desc    Get bookmarks (with optional tag filtering)
// @route   GET /api/bookmarks
const getBookmarks = async (req, res) => {
  try {
    const { tags, mode } = req.query;
    let query = {};

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      if (mode === 'all') {
        query.tags = { $all: tagArray };
      } else {
        query.tags = { $in: tagArray };
      }
    }

    const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: bookmarks.length, data: bookmarks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error processing tags' });
  }
};

// @desc    Create a new bookmark
// @route   POST /api/bookmarks
const createBookmark = async (req, res) => {
  try {
    const { title, url, tags } = req.body;
    
    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Please provide title and url' });
    }

    const bookmark = await Bookmark.create({ title, url, tags });
    res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create bookmark' });
  }
};

module.exports = {
  getBookmarks,
  createBookmark
};