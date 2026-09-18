const BudgetTrack = require('../models/BudgetTrack');

// Get all budget tracking records with variance calculations
exports.getBudgetRecords = async (req, res) => {
  try {
    const records = await BudgetTrack.find().sort({ createdAt: -1 });
    
    const enhancedRecords = records.map(item => {
      const variance = item.amountBudgeted - item.amountSpent;
      const variancePercentage = item.amountBudgeted > 0 
        ? Number(((variance / item.amountBudgeted) * 100).toFixed(2)) 
        : 0;
        
      return {
        ...item._doc,
        variance,
        variancePercentage
      };
    });

    res.status(200).json(enhancedRecords);
  } catch (error) {
    console.error("Error fetching budget records:", error);
    res.status(500).json({ error: "Failed to fetch budget tracking data" });
  }
};

// Add a new budget tracking entry
exports.createBudgetRecord = async (req, res) => {
  try {
    const newRecord = new BudgetTrack(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error creating budget record:", error);
    res.status(500).json({ error: "Failed to create budget record" });
  }
};