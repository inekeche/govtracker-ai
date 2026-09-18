const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  citizenEmail: { type: String, default: 'Anonymous Citizen' },
  satisfaction: { type: String, enum: ['Satisfied', 'Neutral', 'Dissatisfied'], default: 'Satisfied' },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  agency: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String },
  accessLink: { type: String },
  ratings: [ratingSchema]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);