const express = require('express');
const JobListing = require('../models/JobListing');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (_request, response) => {
  const listings = await JobListing.find().sort({ createdAt: -1 });
  response.json(listings);
}));

router.post('/', asyncHandler(async (request, response) => {
  const listing = await JobListing.create(request.body);
  response.status(201).json(listing);
}));

module.exports = router;
