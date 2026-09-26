const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema({
  employerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  salary: { type: Number, required: true, min: 0 },
  salaryType: { type: String, required: true, enum: ['DAILY', 'MONTHLY'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JobListing', jobListingSchema);
