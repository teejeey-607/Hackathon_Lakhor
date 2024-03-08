// backend/controllers/otpController.js

const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '728a2294',
  apiSecret: 'pzmO0PQ1fmttrGzc',
});

// In-memory storage for OTPs (for demonstration purposes)
const otpMap = {};

// Function to generate a random 4-digit code
function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Function to send an SMS
function sendSms(from, to, message) {
  return new Promise((resolve, reject) => {
    nexmo.message.sendSms(from, to, message, (err, responseData) => {
      if (err) {
        console.error('Error sending SMS:', err);
        reject(err);
      } else {
        console.log('SMS sent successfully:', responseData);
        resolve(responseData);
      }
    });
  });
}

// Controller function for the /send-sms route
async function sendSmsController(req, res) {
  try {
    const { phoneNumber } = req.body;

    // Generate a 4-digit verification code
    const verificationCode = generateVerificationCode();

    // Include the verification code in the SMS message
    const message = `Your verification code is: ${verificationCode}`;
    const from = '+97577858660'; // Use a Vonage virtual number or your registered number

    // Send SMS
    await sendSms(from, phoneNumber, message);

    // Save current timestamp for OTP
    const timestamp = Date.now();

    // Save OTP, associate it with the phone number, and store the timestamp
    otpMap[phoneNumber] = { code: verificationCode, timestamp };

    // Respond to the client
    res.json({ success: true, message: 'SMS sent successfully', verificationCode });
  } catch (error) {
    console.error('Error in send-sms:', error);
    res.status(500).json({ success: false, message: 'Error sending SMS' });
  }
}

// Controller function for the /verify-otp route
function verifyOtpController(req, res) {
  try {
    const { phoneNumber, otp } = req.body;

    // Retrieve the stored OTP and timestamp for the phone number
    const storedOtp = otpMap[phoneNumber];

    if (storedOtp && storedOtp.code === otp) {
      // Check if OTP is used within 2 minutes (120,000 milliseconds)
      const timeDifference = Date.now() - storedOtp.timestamp;
      const timeLimit = 120000; // 2 minutes in milliseconds

      if (timeDifference <= timeLimit) {
        // Successful verification within time limit
        delete otpMap[phoneNumber]; // Clear the OTP after successful verification
        res.json({ success: true, message: 'OTP verified successfully. Login successful.' });
      } else {
        // OTP expired
        delete otpMap[phoneNumber];
        res.status(401).json({ success: false, message: 'OTP expired. Login failed.' });
      }
    } else {
      // Failed verification
      res.status(401).json({ success: false, message: 'Invalid OTP. Login failed.' });
    }
  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
}

module.exports = {
  sendSmsController,
  verifyOtpController,
};
