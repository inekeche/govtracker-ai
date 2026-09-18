const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const ServiceRating = require('../models/ServiceRating'); // Must match filename/export

// 1. GET: Fetch all ratings for admin portal
router.get('/admin/all-ratings', async (req, res) => {
  try {
    const ratings = await ServiceRating.find().sort({ createdAt: -1 });
    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching admin ratings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET: Fetch all public services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. POST: Submit a rating/scrutiny audit
router.post('/rate', async (req, res) => {
  try {
    const { serviceName, agency, category, rating, comment, userEmail } = req.body;

    const newRating = new ServiceRating({
      serviceName: serviceName || 'Public Institution',
      agency: agency || 'Government Agency',
      category: category || 'Public Service',
      rating: rating || 'Satisfied',
      comment: comment || '',
      userEmail: userEmail || 'Anonymous Citizen'
    });

    const savedRating = await newRating.save();
    res.status(201).json({ 
      success: true, 
      message: 'Service rating submitted successfully', 
      data: savedRating 
    });
  } catch (error) {
    console.error('Error saving service rating:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;