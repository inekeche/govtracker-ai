const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  citizenEmail: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const decisionSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  impactSummary: { type: String, required: true },
  favorableVotes: { type: Number, default: 0 },
  unfavorableVotes: { type: Number, default: 0 },
  suggestions: [suggestionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Decision', decisionSchema);