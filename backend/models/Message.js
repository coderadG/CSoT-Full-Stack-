const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['SENT', 'DELIVERED', 'SEEN'], 
    default: 'SENT' 
  }
}, { timestamps: true }); // adds createdAt, updatedAt automatically

module.exports = mongoose.model('Message', messageSchema);
