// Load environment variables (if .env file exists)
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // ✅ Add this

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mychatdb')

.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Initialize app
const app = express();

// Middleware
app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse incoming JSON data

// Sample route
app.get('/', (req, res) => {
    res.send('API is running...');
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
