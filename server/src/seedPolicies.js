const mongoose = require('mongoose');
require('dotenv').config();

// Define a Policy Schema or use your existing model if you have one
const policySchema = new mongoose.Schema({
  title: String,
  issuingAgency: String,
  fullText: String,
  simplifiedSummary: String,
  keyTakeaways: [String],
  createdAt: { type: Date, default: Date.now }
});

const Policy = mongoose.model('Policy', policySchema);

const samplePolicies = [
  {
    title: "Host Communities Development Trust Regulations (PIA 2021)",
    issuingAgency: "Nigerian Upstream Petroleum Regulatory Commission (NUPRC)",
    fullText: "The settlor shall incorporate the host communities development trust pursuant to section 231 of the Act for the benefit of the host communities. The trust shall allocate 3% of its actual annual operational expenditure of the preceding financial year in the upstream petroleum operations to the host communities development fund.",
    simplifiedSummary: "Oil companies must set up a special trust fund for local host communities, contributing 3% of their previous year's operating budget directly into community development projects.",
    keyTakeaways: [
      "Mandates 3% operational expenditure allocation.",
      "Aims to foster sustainable prosperity and peaceful coexistence.",
      "Requires transparent governance and direct community involvement."
    ]
  },
  {
    title: "Public Procurement and Fiscal Transparency Act Guidelines",
    issuingAgency: "Bureau of Public Procurement (BPP)",
    fullText: "All procuring entities shall ensure that capital project awards above fifty million Naira are published on the national open contracting portal within fourteen days of award, detailing the contractor name, schedule of completion, and milestone disbursement frameworks.",
    simplifiedSummary: "Every government contract worth over ₦50 million must be publicly posted online within 2 weeks so citizens can track who won the bid and when it should be finished.",
    keyTakeaways: [
      "Applies to all projects exceeding ₦50 million.",
      "Mandates public disclosure within 14 days.",
      "Enhances citizen oversight on project milestones."
    ]
  }
];

const seedPolicies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for policy seeding...");

    await Policy.deleteMany({});
    await Policy.insertMany(samplePolicies);

    console.log("Database seeded successfully with sample policies!");
    process.exit();
  } catch (err) {
    console.error("Policy seeding failed:", err);
    process.exit(1);
  }
};

seedPolicies();