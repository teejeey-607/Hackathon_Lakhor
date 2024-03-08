// backend/routes/otpRoutes.js

const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// Route for sending SMS
router.post('/send-otp', otpController.sendSmsController);

// Route for verifying OTP
router.post('/verify-otp', otpController.verifyOtpController);

module.exports = router;
