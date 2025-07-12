const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');

const otpStore = {}; // temporary in-memory OTP storage

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// ✅ Send OTP to user's email
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, expires: Date.now() + 300000 }; // 5 min

  try {
    await transporter.sendMail({
      from: `"Society Admin" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.Any issues contact admin Lohith with reply to same mail.`
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Email error" });
  }
});

// ✅ Verify OTP and reset password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const entry = otpStore[email];

  if (!entry || entry.otp != otp || Date.now() > entry.expires) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.password = newPassword;
  await user.save();

  delete otpStore[email];
  res.json({ success: true, message: "Password updated" });
});

module.exports = router;
