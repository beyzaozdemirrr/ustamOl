const JobListing = require('../models/JobListing');

async function getJobListings(request, response) {
  console.log("Gelen \u015Eehir Filtresi:", request.query.city);
  const city = typeof request.query.city === 'string' ? request.query.city.trim() : '';
  let query = {};
  if (city !== '') {
    query.city = { $regex: city, $options: 'i' };
  }

  const listings = await JobListing.find(query).sort({ createdAt: -1 });
  console.log("Filtrelenen Sonu\u00E7 Say\u0131s\u0131:", listings.length);
  return response.json(listings);
}

async function createJobListing(request, response) {
  const listing = await JobListing.create({ ...request.body, city: request.body.city });
  return response.status(201).json(listing);
}

module.exports = { getJobListings, createJobListing };
