const Decision = require('../models/Decision');

// Get all decisions
exports.getDecisions = async (req, res) => {
  try {
    const decisions = await Decision.find().sort({ createdAt: -1 });
    res.status(200).json(decisions);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching decisions' });
  }
};

// Vote on a decision (favorable / unfavorable)
exports.voteDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'favorable' or 'unfavorable'

    const decision = await Decision.findById(id);
    if (!decision) return res.status(404).json({ error: 'Decision not found' });

    if (voteType === 'favorable') {
      decision.favorableVotes += 1;
    } else if (voteType === 'unfavorable') {
      decision.unfavorableVotes += 1;
    }

    await decision.save();
    res.status(200).json(decision);
  } catch (err) {
    res.status(500).json({ error: 'Server error processing vote' });
  }
};

// Submit citizen suggestion / alternative input
exports.addSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { citizenEmail, comment } = req.body;

    const decision = await Decision.findById(id);
    if (!decision) return res.status(404).json({ error: 'Decision not found' });

    decision.suggestions.push({ citizenEmail, comment });
    await decision.save();

    res.status(201).json(decision);
  } catch (err) {
    res.status(500).json({ error: 'Server error saving suggestion' });
  }
};