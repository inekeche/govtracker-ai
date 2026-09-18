const mongoose = require('mongoose');

const budgetTrackSchema = new mongoose.Schema({
  projectTitle: { type: String, required: true },
  sector: { type: String, required: true },
  amountBudgeted: { type: Number, required: true },
  amountSpent: { type: Number, required: true },
  contractor: { type: String, required: true },
  status: { type: String, enum: ['Completed', 'Ongoing', 'Delayed', 'Abandoned'], default: 'Ongoing' },
  fiscalYear: { type: String, required: true },
  geoLocation: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BudgetTrack', budgetTrackSchema);