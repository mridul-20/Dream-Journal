const mongoose = require('mongoose');

const DreamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [50, 'Title cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  emotions: {
    type: [String],
    required: true,
    enum: [
      'joy', 'fear', 'anger', 'sadness', 'surprise', 
      'excitement', 'peace', 'confusion', 'love', 'anxiety', 'freedom'
    ]
  },
  tags: {
    type: [String],
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'adventure', 'nightmare', 'lucid', 'recurring', 
      'prophetic', 'fantasy', 'realistic', 'abstract',
    ]
  },
  lucid: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Dream', DreamSchema);