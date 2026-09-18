const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// 1. GET: Fetch all reports for the Admin Portal
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    console.log(`Admin fetched ${reports.length} community reports.`);
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. POST: Submit a new community issue report
router.post('/', async (req, res) => {
  try {
    console.log('Incoming Report Payload Summary:', {
      title: req.body.title,
      category: req.body.category,
      hasEvidence: !!req.body.evidence || !!req.body.imageUrl || !!req.body.file,
      evidenceLength: req.body.evidence ? req.body.evidence.length : 0
    });

    const { 
      title, 
      category, 
      description, 
      latitude, 
      longitude, 
      evidence, 
      imageUrl,
      photo,
      file,
      isAnonymous 
    } = req.body;

    // Use whichever property the frontend sent
    const finalEvidence = evidence || imageUrl || photo || file || '';

    const newReport = new Report({
      title,
      category,
      description,
      latitude,
      longitude,
      evidence: finalEvidence,
      imageUrl: finalEvidence,
      photo: finalEvidence,
      file: finalEvidence,
      isAnonymous: isAnonymous !== undefined ? isAnonymous : true
    });

    const savedReport = await newReport.save();
    console.log("Successfully saved report ID:", savedReport._id, "With file data length:", finalEvidence.length);

    res.status(201).json({ 
      success: true, 
      message: 'Report submitted and saved successfully', 
      data: savedReport 
    });
  } catch (error) {
    console.error('Error saving report to database:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;