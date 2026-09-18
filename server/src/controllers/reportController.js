const Project = require('../models/Project');
const Report = require('../models/Report');

// @desc    Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// @desc    Create a new citizen report
const createReport = async (req, res) => {
  try {
    const { title, description, category, latitude, longitude, evidence } = req.body;
    
    const newReport = new Report({ 
      title, 
      description, 
      category, 
      latitude, 
      longitude, 
      evidence // Saves the Base64 file string to MongoDB
    });
    
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
};

module.exports = {
  getProjects,
  createReport,
};