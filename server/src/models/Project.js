const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budgetAllocated: { type: Number, required: true },
  fundsReleased: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);