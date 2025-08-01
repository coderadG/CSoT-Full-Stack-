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
  origin: 'http://localhost:3000', // ✅ Only allow requests from frontend
  credentials: true
}));
app.use(express.json()); // Parse incoming JSON

// Sample root route for API health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import and use authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import and use message routes
const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
