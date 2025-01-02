const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  contactAddress: {
    type: String,
    required: true,
  },
  businessAddress: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
    enum: ['Sole Proprietorship', 'Partnership', 'Limited Liability Company (LLC)', 'Corporation', 'Non-Profit Organization'],
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  licenses: {
    type: String,
    required: true,
  },
  documents: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'rejected', 'approved'],
    default: 'waiting',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Business', BusinessSchema);