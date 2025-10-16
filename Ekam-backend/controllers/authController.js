// controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// Send OTP
exports.sendOTP = async (req, res) => {
    const { mobile } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

    try {
        await User.findOneAndUpdate(
            { mobile },
            { otp, otpExpires: Date.now() + 300000 }, // 5 minutes validity
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`OTP for ${mobile} is: ${otp}`);
        res.status(200).json({ success: true, message: "OTP sent (check console)." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error sending OTP." });
    }
};

// Verify OTP and generate JWT token
exports.verifyOTP = async (req, res) => {
    const { mobile, otp } = req.body;
    try {
        const user = await User.findOne({
            mobile,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // ++ IMPORTANT: Generate a JWT Token ++
        const token = jwt.sign(
            { id: user._id, mobile: user.mobile },
            process.env.JWT_SECRET, // Make sure to add JWT_SECRET to your .env and Railway variables
            { expiresIn: '30d' }
        );

        res.status(200).json({ success: true, message: "Login Successful!", token, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during verification." });
    }
};