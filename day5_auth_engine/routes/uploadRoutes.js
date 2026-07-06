import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Upload profile picture
// @route   POST /api/upload/avatar
// @access  Private
router.post('/avatar', protect, (req, res, next) => {
  
  // 1. Manually trigger Multer so we can catch the hidden Cloudinary error
  upload.single('image')(req, res, (err) => {
    if (err) {
      // Force the [object Object] into a readable string in the terminal
      console.error("\n❌ CLOUDINARY/MULTER ERROR:", JSON.stringify(err, null, 2));
      
      // Send the real error back to Postman instead of the HTML page
      return res.status(500).json({ 
        message: 'Upload Middleware Crashed', 
        errorDetails: err 
      });
    }
    
    // If no error, continue to the main route logic
    next();
  });

}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const imageUrl = req.file.path;

    const user = await User.findById(req.user._id);
    if (user) {
      user.profilePicture = imageUrl; 
      await user.save();
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Database saving failed', error: error.message });
  }
});

export default router;