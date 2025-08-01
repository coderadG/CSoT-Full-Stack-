console.log('Auth router loaded');

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');

// ✅ Correct Firebase Admin import
const { db } = require('../firebaseAdmin'); 


/**
 * 🔐 Register Route
 */
router.post('/register', async (req, res) => {
  console.log('Register route hit');
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    // ✅ Sync new user to Firebase ChatUsers
    await db.ref(`ChatUsers/${savedUser._id}`).set({
    userId: savedUser._id.toString(),
    username: savedUser.username,
    email: savedUser.email,
    status: "offline",
    photo: "",
    flag: "chat"
    });


    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * 🔓 Login Route
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Update status to online in Firebase
    await db.ref(`ChatUsers/${user._id}`).update({ status: "online" });


    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * 👥 Get All Users (except current) – Protected
 */
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

/**
 * 👤 Get Current User Profile – Protected
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * 📝 Update Profile – Protected
 */
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Update username in Firebase as well
    await update(ref(db, `ChatUsers/${req.user._id}`), {
      username: user.username
    });

    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * ❌ Delete Profile – Protected
 */
router.delete('/profile', verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    // ✅ Remove user from Firebase
    await db.ref(`ChatUsers/${req.user._id}`).remove();


    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * 🔧 Test Routes
 */
router.get('/test', (req, res) => {
  res.send('Auth test route works');
});

router.post('/test', (req, res) => {
  console.log('POST /api/auth/test route hit');
  res.send('POST test route works');
});

module.exports = router;
