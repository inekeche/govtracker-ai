const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  institution: { type: String, required: true }, // e.g., Ministry of Works, Local Council
  description: { type: String, required: true },
  impactSummary: { type: String, required: true },
  favorableVotes: { type: Number, default: 0 },
  unfavorableVotes: { type: Number, default: 0 },
  suggestions: [{
    citizenEmail: String,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InstitutionDecision', decisionSchema);