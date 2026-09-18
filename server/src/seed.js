const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('./src/models/Project');
const Service = require('./src/models/Service');

const sampleProjects = [
  {
    title: "Dual Carriageway & Inter-State Road Expansion",
    description: "Construction and asphalt overlay connecting regional feeder routes to improve transit efficiency.",
    category: "Roads",
    location: "Kogi-Anambra Border Axis",
    budgetAllocated: 450000000,
    fundsReleased: 200000000,
    status: "Ongoing"
  },
  {
    title: "Primary Healthcare Center Renovation",
    description: "Upgrading community medical facilities with modern diagnostic equipment and solar power backup.",
    category: "Healthcare",
    location: "Ibaji Central District",
    budgetAllocated: 85000000,
    fundsReleased: 85000000,
    status: "Completed"
  },
  {
    title: "Community Water Solar Borehole Project",
    description: "Installation of motorized solar-powered boreholes and overhead storage tanks for clean water access.",
    category: "Water",
    location: "Oboyo Community Ward",
    budgetAllocated: 35000000,
    fundsReleased: 10000000,
    status: "Planning"
  }
];

const sampleServices = [
  {
    title: "Public Healthcare Emergency & Maternal Support",
    agency: "State Ministry of Health",
    category: "Healthcare Facilities",
    description: "Provides free maternal care consultation, immunization tracking, and emergency ambulance dispatch across local community clinics.",
    eligibility: "All registered citizens residing within the state.",
    accessLink: "https://example-health-portal.gov.ng",
    ratings: []
  },
  {
    title: "Rural Clean Water & Solar Borehole Provision",
    agency: "State Water Board",
    category: "Water Supply & Boreholes",
    description: "Community-wide solar-powered borehole installations to ensure steady potable water supply and maintenance support.",
    eligibility: "Open to all verified rural community clusters.",
    accessLink: "https://example-waterboard.gov.ng",
    ratings: []
  },
  {
    title: "Host Community Development Trust Fund (HCDTF)",
    agency: "Upstream Petroleum Regulatory Commission",
    category: "Infrastructure & Energy",
    description: "Statutory 3% allocation management for infrastructural development, youth capacity building, and economic empowerment in oil-producing regions.",
    eligibility: "Indigenes and registered community associations within designated host communities.",
    accessLink: "https://example-hcdtf.gov.ng",
    ratings: []
  }
];

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/govtracker');
    console.log("Connected to MongoDB for unified seeding...");

    // Seed Projects
    await Project.deleteMany({});
    await Project.insertMany(sampleProjects);
    console.log("✔ Sample projects seeded successfully!");

    // Seed Services
    await Service.deleteMany({});
    await Service.insertMany(sampleServices);
    console.log("✔ Sample public services seeded successfully!");

    console.log("Database seeding completed for all modules.");
    process.exit(0);
  } catch (err) {
    console.error("Unified seeding failed:", err);
    process.exit(1);
  }
};

seedAll();