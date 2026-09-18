const express = require('express');
const router = express.Router();
const { getDecisions, voteDecision, addSuggestion } = require('../controllers/decisionController');

router.get('/', getDecisions);
router.post('/:id/vote', voteDecision);
router.post('/:id/suggestion', addSuggestion);

module.exports = router;