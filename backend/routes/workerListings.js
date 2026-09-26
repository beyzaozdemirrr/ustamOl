const express = require('express');
const WorkerListing = require('../models/WorkerListing');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (_request, response) => {
  const listings = await WorkerListing.find().sort({ createdAt: -1 });
  response.json(listings);
}));

router.post('/', asyncHandler(async (request, response) => {
  const listing = await WorkerListing.create(request.body);
  response.status(201).json(listing);
}));

module.exports = router;
