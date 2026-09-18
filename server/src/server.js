const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const reportRoutes = require('./routes/reports');
const serviceRoutes = require('./routes/services');
const apiRoutes = require('./routes/apiRoutes');
const authRouter = require('./routes/auth');
const budgetRoutes = require('./routes/budgetRoutes');
const decisionRoutes = require('./routes/decisionRoutes');


// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middleware & CRITICAL: Expand body size limits to handle large Base64 media files & evidence
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api', apiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRouter);
app.use('/api/budgets', budgetRoutes);
app.use('/api/decisions', decisionRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: "GovTracker AI API is running with MongoDB!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});