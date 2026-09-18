const mongoose = require('mongoose');
const BudgetTrack = require('./models/BudgetTrack');
require('dotenv').config();

const sampleBudgets = [
  {
    projectTitle: "Ibaji-Anambra Interstate Dual Carriageway Stabilization",
    sector: "Infrastructure",
    amountBudgeted: 1500000000,
    amountSpent: 1250000000,
    contractor: "Multiflexzy Engineering Ltd",
    status: "Ongoing",
    fiscalYear: "2026",
    geoLocation: "Kogi-Anambra Border Axis"
  },
  {
    projectTitle: "3% HCDT Grassroots Micro-Projects & Solar Water Schemes",
    sector: "Host Communities Development",
    amountBudgeted: 450000000,
    amountSpent: 480000000,
    contractor: "Oboyo Development Consortium",
    status: "Delayed",
    fiscalYear: "2026",
    geoLocation: "Oboyo-Ibaji Sector"
  },
  {
    projectTitle: "Public Secondary School E-Learning Hub Integration",
    sector: "Education",
    amountBudgeted: 300000000,
    amountSpent: 180000000,
    contractor: "Inekeche Tech Solutions",
    status: "Ongoing",
    fiscalYear: "2026",
    geoLocation: "Zonal Education District 1"
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/govtracker');
    await BudgetTrack.deleteMany({});
    await BudgetTrack.insertMany(sampleBudgets);
    console.log("Database seeded successfully with BudgetTrack records!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDB();