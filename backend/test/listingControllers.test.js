const assert = require('node:assert/strict');
const test = require('node:test');
const JobListing = require('../models/JobListing');
const WorkerListing = require('../models/WorkerListing');
const jobController = require('../controllers/jobListingController');
const workerController = require('../controllers/workerListingController');

async function callWithMocks(Model, operation, request) {
  const originalFind = Model.find;
  const originalCreate = Model.create;
  const originalLog = console.log;
  const captured = { logs: [] };
  const documents = [{ _id: 'listing-1', city: 'Ankara' }];
  Model.find = (query) => {
    captured.query = query;
    return { sort: async (sort) => { captured.sort = sort; return documents; } };
  };
  Model.create = async (body) => { captured.body = body; return body; };
  console.log = (...args) => captured.logs.push(args);
  const response = {
    status(code) { captured.status = code; return this; },
    json(body) { captured.response = body; return body; },
  };

  try {
    await operation(request, response);
  } finally {
    Model.find = originalFind;
    Model.create = originalCreate;
    console.log = originalLog;
  }
  return captured;
}

for (const [name, Model, controller] of [
  ['job', JobListing, jobController],
  ['worker', WorkerListing, workerController],
]) {
  test(name + ' GET filters by trimmed city case-insensitively and logs result count', async () => {
    const result = await callWithMocks(Model, controller[name === 'job' ? 'getJobListings' : 'getWorkerListings'], {
      query: { city: ' Ankara ' },
    });
    assert.deepEqual(result.query, { city: { $regex: 'Ankara', $options: 'i' } });
    assert.deepEqual(result.sort, { createdAt: -1 });
    assert.equal(result.response.length, 1);
    assert.deepEqual(result.logs, [
      ['Gelen \u015Eehir Filtresi:', ' Ankara '],
      ['Filtrelenen Sonu\u00E7 Say\u0131s\u0131:', 1],
    ]);
  });

  test(name + ' GET leaves query empty when city is omitted or blank', async () => {
    const noCity = await callWithMocks(Model, controller[name === 'job' ? 'getJobListings' : 'getWorkerListings'], { query: {} });
    const blankCity = await callWithMocks(Model, controller[name === 'job' ? 'getJobListings' : 'getWorkerListings'], { query: { city: '  ' } });
    assert.deepEqual(noCity.query, {});
    assert.deepEqual(blankCity.query, {});
  });

  test(name + ' POST passes city through to Mongo model', async () => {
    const postController = controller[name === 'job' ? 'createJobListing' : 'createWorkerListing'];
    const result = await callWithMocks(Model, postController, { body: { city: 'Ankara', title: 'test' } });
    assert.equal(result.status, 201);
    assert.equal(result.body.city, 'Ankara');
  });
}

test('both listing schemas use the required lowercase city string field', () => {
  for (const Model of [JobListing, WorkerListing]) {
    const cityPath = Model.schema.path('city');
    assert.ok(cityPath);
    assert.equal(cityPath.instance, 'String');
    assert.equal(cityPath.options.required, true);
    assert.equal(Model.schema.path('City'), undefined);
  }
});
