const express = require('express');
const router = express.Router();
const { register,forgotPassword, resetPassword } = require('../controller/authController');
const { checkPasswordStrength } = require('../middleware/passwordStrength');


router.post('/register', register);

router.post('/forgot-password', forgotPassword);

// Note: We apply the strength checker middleware here, before hitting the reset controller
router.put('/reset-password/:token', checkPasswordStrength, resetPassword);

module.exports = router;