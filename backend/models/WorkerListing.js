const mongoose = require('mongoose');

const workerListingSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 16, max: 100 },
  city: { type: String, required: true, trim: true },
  profession: { type: String, required: true, trim: true },
  workFields: {
    type: [{ type: String, trim: true }],
    required: true,
    validate: {
      validator: (fields) => Array.isArray(fields) && fields.length > 0,
      message: 'En az bir çalışma alanı girilmelidir.',
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WorkerListing', workerListingSchema);
