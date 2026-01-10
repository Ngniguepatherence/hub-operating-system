const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a space name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['office', 'conference', 'coworking', 'studio'],
    required: [true, 'Please provide a space type']
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide capacity'],
    min: 1
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Please provide price per hour'],
    min: 0
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  currentBooking: {
    client: String,
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client'
    },
    until: Date,
    date: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Space', spaceSchema);

