const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { getJobListings, createJobListing } = require('../controllers/jobListingController');

const router = express.Router();

router.get('/', asyncHandler(getJobListings));
router.post('/', asyncHandler(createJobListing));

module.exports = router;
