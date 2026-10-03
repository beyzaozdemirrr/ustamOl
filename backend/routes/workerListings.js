const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { getWorkerListings, createWorkerListing } = require('../controllers/workerListingController');

const router = express.Router();

router.get('/', asyncHandler(getWorkerListings));
router.post('/', asyncHandler(createWorkerListing));

module.exports = router;
