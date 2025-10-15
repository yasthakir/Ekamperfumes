const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        unique: true, // Each mobile number must be unique
        trim: true,
    },
    // Optional: Add other user details you might need later
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        sparse: true, // Allows multiple users to have an empty email field
    },
    // Fields for OTP verification
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);