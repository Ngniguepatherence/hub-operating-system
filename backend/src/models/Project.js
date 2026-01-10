const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true
  },
  client: {
    type: String,
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Please provide a client ID']
  },
  type: {
    type: String,
    enum: ['video', 'audio', 'podcast'],
    required: [true, 'Please provide a project type']
  },
  status: {
    type: String,
    enum: ['briefing', 'quote', 'production', 'review', 'delivery', 'completed'],
    default: 'briefing'
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline']
  },
  budget: {
    type: Number,
    required: [true, 'Please provide a budget'],
    min: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  assignee: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);

