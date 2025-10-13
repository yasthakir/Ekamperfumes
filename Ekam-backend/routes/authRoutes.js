const express = require('express');
const router = express.Router();

// Import the controller functions
const { sendOTP, verifyOTP } = require('../controllers/authController');

// Route for sending an OTP
// URL: POST /api/auth/send-otp
router.post('/send-otp', sendOTP);

// Route for verifying an OTP
// URL: POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTP);

module.exports = router;