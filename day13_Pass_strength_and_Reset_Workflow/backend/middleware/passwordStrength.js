exports.checkPasswordStrength = (req, res, next) => {
    // Assuming the new password comes in as req.body.password
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Please provide a password' });
    }

    // Production Regex: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(password)) {
        return res.status(400).json({ 
            error: 'Password is too weak. It must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.' 
        });
    }

    next();
};