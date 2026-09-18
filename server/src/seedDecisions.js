const mongoose = require('mongoose');
const Decision = require('./models/Decision');
require('dotenv').config();

const sampleDecisions = [
  {
    institution: "Federal Ministry of Works & Housing",
    title: "Interstate Dual Carriageway Expansion Project (Ibaji-Anambra Corridor)",
    description: "Proposed approval for the immediate dualization and stabilization of key arterial feeder corridors connecting agricultural producing communities across state boundaries.",
    impactSummary: "Aims to reduce transit overhead by 45%, improve agricultural produce supply chains, and mitigate seasonal flooding risks along low-lying routes.",
    favorableVotes: 142,
    unfavorableVotes: 18,
    suggestions: [
      { citizenEmail: "inekeonubifelix@gmail.com", comment: "Ensure proper drainage culverts are integrated near flood-prone sections to protect community farmlands." }
    ]
  },
  {
    institution: "Nigerian Upstream Petroleum Regulatory Commission (NUPRC)",
    title: "Host Communities Development Trust (HCDT) Fund Allocation Framework",
    description: "Implementation guideline concerning the transparent disbursement of the 3% operating expenditure trust fund to registered community board trustees.",
    impactSummary: "Directly impacts grassroots infrastructure funding, local vocational training grants, and micro-project execution timelines across oil-producing local areas.",
    favorableVotes: 98,
    unfavorableVotes: 54,
    suggestions: [
      { citizenEmail: "community.lead@oboyo.org", comment: "Mandate quarterly public audits to verify that trust funds reach grassroots development projects directly." }
    ]
  }
];

async function seedDB() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/govtracker');
  await Decision.deleteMany({});
  await Decision.insertMany(sampleDecisions);
  console.log("Database seeded with sample institutional decisions!");
  mongoose.connection.close();
}

seedDB();