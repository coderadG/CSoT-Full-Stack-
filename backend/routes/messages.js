const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Import the Message model
const verifyToken = require('../middleware/verifyToken'); // Use verifyToken middleware

// POST: Send a new message
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { to, text } = req.body;

    if (!text || !to) {
      return res.status(400).json({ error: 'Missing text or recipient' });
    }

    // Save message in MongoDB
    const newMessage = new Message({
      sender: req.user._id || req.user.id, // from verified token
      receiver: to,
      content: text,
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    console.error("Message save error:", err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET: Fetch conversation history with a specific user
router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const myId = req.user._id || req.user.id;
    const partnerId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: partnerId },
        { sender: partnerId, receiver: myId }
      ]
    }).sort({ createdAt: 1 }); // Oldest to newest

    res.status(200).json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;

