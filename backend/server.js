// Load environment variables (if .env file exists)
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // ✅ Only allow this origin
  credentials: true
}));
 // Handle cross-origin requests
app.use(express.json()); // Parse incoming JSON data

// Sample route
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.post('/api/messages/send', (req, res) => {
  const { text, to } = req.body;

  // ✅ Validate input
  if (!text || !to) {
    return res.status(400).json({ error: 'Missing text or recipient' });
  }

  // ✅ Simulate saving or acknowledge message
  // If you're not using DB, just return a dummy "sent" message with a fake ID & timestamp
  const message = {
    id: Date.now().toString(), // fake unique ID
    text,
    to,
    from: "user1", // hardcoded or from auth in real use
    timestamp: new Date().toISOString()
  };

  return res.status(201).json({ message });
});


// Start server
const PORT = process.env.PORT || 5000;
// Import auth routes
const authRoutes = require('./routes/auth');

// Use auth routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);

});
