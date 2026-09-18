const express = require('express');
const router = express.Router();
const { getProjects, createReport } = require('../controllers/reportController');

router.get('/projects', getProjects);
router.post('/reports', createReport);

module.exports = router;