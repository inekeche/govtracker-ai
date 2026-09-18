const router = require('express').Router();
const User = require('../models/User');

// Register Endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', email: newUser.email });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    res.json({ message: 'Login successful', email: user.email, name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// Update User Profile & Settings Endpoint
router.put('/profile', async (req, res) => {
  try {
    const { email, name, profilePhoto, bio, notificationsEnabled } = req.body;
    
    const user = await User.findOneAndUpdate(
      { email },
      { name, profilePhoto, bio, notificationsEnabled },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

module.exports = router;