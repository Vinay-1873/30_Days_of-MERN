const crypto = require('crypto');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists with that email' });
        }

        // 2. Create the user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        // 3. Return success
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

// @desc    Forgot Password - Generates token and simulates email
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }

        // 1. Generate a raw, secure 20-character hex token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 2. Hash the token using SHA-256 and save it to the user document
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // 3. Set expiration to 15 minutes from now
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // 4. Simulate sending the email by constructing the reset URL
        // In a real app, you'd pass this URL into Nodemailer or SendGrid
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        
        console.log(`\n📧 SIMULATED EMAIL DELIVERED TO: ${user.email}`);
        console.log(`🔗 Click here to reset password: ${resetUrl}\n`);

        res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Reset Password - Verifies token and updates password
// @route   PUT /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
    try {
        // 1. Hash the raw token from the URL params so we can compare it to the DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // 2. Find a user with this hashed token AND an expiration date in the future
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() } // $gt means "greater than"
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // 3. Update the password 
        // (Assuming you have a 'pre-save' hook in your User model that handles bcrypt hashing)
        user.password = req.body.password;

        // 4. Clear the reset token fields—they shouldn't be usable again
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successfully. You can now log in.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};