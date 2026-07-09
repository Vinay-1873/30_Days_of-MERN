const Bookmark = require('../models/Bookmark');
const axios = require('axios');
const cheerio = require('cheerio');

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

// @desc    Create a new bookmark by scrapping URL
// @route   POST /api/bookmarks
const createBookmark = async (req, res) => {
  try {
    const { url, tags } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, message: 'Please provide a url' });
    }
    // 1. Fetch the HTML of the target website
    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' } // Some sites block bots, this helps bypass that
    });
    // 2. Load the HTML into Cheerio
    const $ = cheerio.load(html);
    // 3. Extract the title (fallback to 'Untitled' if it doesn't exist)
    const title = $('title').text() || 'Untitled Bookmark';

    // 4. Save to Database
    const bookmark = await Bookmark.create({ 
      title: title.trim(), 
      url, 
      tags: tags || [] // Default to empty array if no tags provided
    });

    res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    console.error('Scraping Error:', error.message);
    // If the scraping fails (e.g., invalid URL), save it anyway as 'Untitled'
    try {
      const fallbackBookmark = await Bookmark.create({ title: 'Untitled Bookmark', url, tags: req.body.tags || [] });
      res.status(201).json({ success: true, data: fallbackBookmark, warning: 'Could not fetch website title' });
    } catch (dbError) {
      res.status(500).json({ success: false, message: 'Failed to create bookmark' });
    }
  }
};

module.exports = {
  getBookmarks,
  createBookmark
};