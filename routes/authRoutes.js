const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Manager = require('../models/Manager');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // fallback

// POST /api/login
router.post('/login', async (req, res) => {
  const { username, password, community, role } = req.body;
  console.log('Login request:', req.body);

  try {
    if (role === 'user') {
      const user = await User.findOne({ username, password, community });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid user credentials' });
      }

      const token = jwt.sign(
        { username: user.username, community: user.community, role: 'user' },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.json({
        success: true,
        redirect: '/user_dashboard.html',
        token,
        houseNumber: user.houseNumber,
        community: user.community
      });
    }

    if (role === 'manager') {
      const manager = await Manager.findOne({ username, password, community });
      if (!manager) {
        return res.status(401).json({ success: false, message: 'Invalid manager credentials' });
      }

      const token = jwt.sign(
        { username: manager.username, community: manager.community, role: 'manager' },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.json({
        success: true,
        redirect: '/manager_dashboard.html',
        token,
        community: manager.community
      });
    }

    res.status(400).json({ success: false, message: 'Invalid role' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
