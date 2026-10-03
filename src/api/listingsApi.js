const API_BASE_URL = 'https://ustamol.onrender.com/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(`API sunucusuna ulaşılamadı: ${API_BASE_URL}`);
  }

  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : null;
  if (!response.ok) {
    throw new Error(data?.error || `API isteği başarısız oldu (${response.status}).`);
  }
  return data;
}

function formatSalary(salary) {
  if (typeof salary === 'number') {
    return `${salary.toLocaleString('tr-TR')} TL`;
  }
  return salary;
}

export function normalizeJobListing(listing) {
  const description = listing.description || '';
  return {
    ...listing,
    id: String(listing.id || listing._id),
    title: listing.title || description.split(/[.!?\n]/)[0].slice(0, 56) || 'Çalışan Aranıyor',
    businessName: listing.businessName || listing.employerName,
    pay: listing.pay || formatSalary(listing.salary),
    payPeriod:
      listing.payPeriod ||
      (listing.salaryType === 'DAILY' ? 'Günlük' : listing.salaryType === 'MONTHLY' ? 'Aylık' : ''),
  };
}

export function normalizeWorkerListing(listing) {
  return {
    ...listing,
    id: String(listing.id || listing._id),
    occupation: listing.occupation || listing.profession,
    workAreas: listing.workAreas || listing.workFields || [],
  };
}

function parseSalary(value) {
  const normalized = String(value)
    .trim()
    .replace(/\s|TL/gi, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.');
  return Number(normalized);
}

function toJobPayload(listing) {
  return {
    employerName: listing.employerName || listing.businessName,
    phone: listing.phone,
    city: listing.city,
    address: listing.address,
    description: listing.description,
    salary: typeof listing.salary === 'number' ? listing.salary : parseSalary(listing.pay),
    salaryType:
      listing.salaryType || (listing.payPeriod === 'Aylık' ? 'MONTHLY' : 'DAILY'),
  };
}

function toWorkerPayload(listing) {
  const workFields = listing.workFields || listing.workAreas;
  return {
    fullName: listing.fullName,
    phone: listing.phone,
    age: Number(listing.age),
    city: listing.city,
    profession: listing.profession || listing.occupation,
    workFields: Array.isArray(workFields)
      ? workFields
      : String(workFields || '').split(/[,;\n]/).map((field) => field.trim()).filter(Boolean),
  };
}

function cityQuery(city) {
  const value = String(city || '').trim();
  return value ? `?city=${encodeURIComponent(value)}` : '';
}

export async function getJobListings(city) {
  const listings = await request(`/job-listings${cityQuery(city)}`);
  return listings.map(normalizeJobListing);
}

export async function getWorkerListings(city) {
  const listings = await request(`/worker-listings${cityQuery(city)}`);
  return listings.map(normalizeWorkerListing);
}

export const fetchJobListings = getJobListings;
export const fetchWorkerListings = getWorkerListings;

export async function fetchListings(city = '') {
  const normalizedCity = String(city || '').trim();
  console.log("Filtreyle ilanlar \u00E7ekiliyor:", normalizedCity);
  const [jobListings, workerListings] = await Promise.all([
    getJobListings(normalizedCity),
    getWorkerListings(normalizedCity),
  ]);
  return { jobListings, workerListings };
}

export async function createJobListing(listing) {
  const created = await request('/job-listings', {
    method: 'POST',
    body: JSON.stringify(toJobPayload(listing)),
  });
  return normalizeJobListing(created);
}

export async function createWorkerListing(listing) {
  const created = await request('/worker-listings', {
    method: 'POST',
    body: JSON.stringify(toWorkerPayload(listing)),
  });
  return normalizeWorkerListing(created);
}
