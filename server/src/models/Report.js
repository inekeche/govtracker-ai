const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  latitude: { 
    type: String 
  },
  longitude: { 
    type: String 
  },
  // Catch-all mapping for evidence strings (Base64 data or URLs)
  evidence: { 
    type: String, 
    default: '' 
  },
  imageUrl: { type: String, default: '' },
  photo: { type: String, default: '' },
  file: { type: String, default: '' },
  
  isAnonymous: { 
    type: Boolean, 
    default: true 
  },
  status: { 
    type: String, 
    default: 'Submitted' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);