const mongoose = require('mongoose');

const serviceRatingSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  agency: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: String, required: true }, // 'Satisfied', 'Neutral', 'Dissatisfied'
  comment: { type: String, required: true },
  userEmail: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRating', serviceRatingSchema);