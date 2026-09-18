const express = require('express');
const router = express.Router();
const { getBudgetRecords, createBudgetRecord } = require('../controllers/budgetController');

router.get('/', getBudgetRecords);
router.post('/', createBudgetRecord);

module.exports = router;