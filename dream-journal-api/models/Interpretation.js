const mongoose = require('mongoose');

const InterpretationSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'Please add a keyword'],
    unique: true,
    trim: true
  },
  meaning: {
    type: String,
    required: [true, 'Please add the meaning'],
    maxlength: [500, 'Meaning cannot be more than 500 characters']
  },
  cultural_origin: {
    type: String,
    required: true,
    enum: ['Western', 'Eastern', 'African', 'Indigenous', 'Universal']
  }
});

module.exports = mongoose.model('Interpretation', InterpretationSchema);