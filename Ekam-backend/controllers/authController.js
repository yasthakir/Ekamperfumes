const User = require('../models/User');

// Send OTP to user's mobile number
exports.sendOTP = async (req, res) => {
    const { mobile } = req.body;
    // For now, we show the OTP in the console instead of sending an SMS
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    try {
        // Update user if they exist, or create a new one
        await User.findOneAndUpdate(
            { mobile },
            { otp, otpExpires: Date.now() + 300000 }, // OTP is valid for 5 minutes
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`OTP for ${mobile} is: ${otp}`); // Shows OTP in the terminal for testing
        res.status(200).json({ success: true, message: "OTP sent successfully (check console)." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error while sending OTP." });
    }
};

// Verify the OTP and log in the user
exports.verifyOTP = async (req, res) => {
    const { mobile, otp } = req.body;
    try {
        const user = await User.findOne({
            mobile,
            otp,
            otpExpires: { $gt: Date.now() } // Check if the OTP has not expired
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        // If login is successful, clear the OTP fields
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // In a real app, you would generate a JWT token here
        res.status(200).json({ success: true, message: "Login Successful!", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during verification." });
    }
};