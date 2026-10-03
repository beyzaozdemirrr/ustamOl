import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  createJobListing,
  createWorkerListing,
  fetchListings as fetchListingsFromApi,
} from '../api/listingsApi';

export { fetchListings } from '../api/listingsApi';

const ListingContext = createContext(null);

function collectCities(jobs, workers) {
  return [...new Set([...jobs, ...workers].map((listing) => listing.city?.trim()).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, 'tr'));
}

function cityMatches(listingCity, filterCity) {
  return String(listingCity || '').toLocaleLowerCase('tr')
    .includes(String(filterCity || '').trim().toLocaleLowerCase('tr'));
}

export function ListingProvider({ children }) {
  const [jobListings, setJobListings] = useState([]);
  const [workerListings, setWorkerListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [appliedCity, setAppliedCity] = useState('');
  const requestVersion = useRef(0);

  const fetchListings = useCallback((city = '') => {
    const normalizedCity = String(city || '').trim();
    const currentRequest = ++requestVersion.current;
    setSelectedCity(normalizedCity);
    setAppliedCity(normalizedCity);
    setIsLoading(true);
    setError(null);

    return fetchListingsFromApi(normalizedCity)
      .then(({ jobListings: jobs, workerListings: workers }) => {
        if (currentRequest !== requestVersion.current) return;
        setJobListings(jobs);
        setWorkerListings(workers);
        if (!normalizedCity) setAvailableCities(collectCities(jobs, workers));
        setError(null);
      })
      .catch((loadError) => {
        if (currentRequest === requestVersion.current) setError(loadError.message);
      })
      .finally(() => {
        if (currentRequest === requestVersion.current) setIsLoading(false);
      });
  }, []);

  const setCityFilter = useCallback((city) => {
    setSelectedCity(String(city || '').trim());
  }, []);

  const refreshListings = useCallback(() => fetchListings(appliedCity), [fetchListings, appliedCity]);

  useEffect(() => {
    let isCurrent = true;
    const currentRequest = ++requestVersion.current;
    fetchListingsFromApi('')
      .then(({ jobListings: jobs, workerListings: workers }) => {
        if (!isCurrent || currentRequest !== requestVersion.current) return;
        setJobListings(jobs);
        setWorkerListings(workers);
        setAvailableCities(collectCities(jobs, workers));
        setError(null);
      })
      .catch((loadError) => {
        if (isCurrent && currentRequest === requestVersion.current) setError(loadError.message);
      })
      .finally(() => {
        if (isCurrent && currentRequest === requestVersion.current) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const addJobListing = useCallback(async (listing) => {
    const createdListing = await createJobListing(listing);
    const nextCity = appliedCity && cityMatches(createdListing.city, appliedCity) ? appliedCity : '';
    setAvailableCities((cities) => collectCities([createdListing], cities.map((city) => ({ city }))));
    setJobListings((current) => [createdListing, ...current.filter((item) => item.id !== createdListing.id)]);
    await fetchListings(nextCity);
    return createdListing;
  }, [appliedCity, fetchListings]);

  const addWorkerListing = useCallback(async (listing) => {
    const createdListing = await createWorkerListing(listing);
    const nextCity = appliedCity && cityMatches(createdListing.city, appliedCity) ? appliedCity : '';
    setAvailableCities((cities) => collectCities(cities.map((city) => ({ city })), [createdListing]));
    setWorkerListings((current) => [createdListing, ...current.filter((item) => item.id !== createdListing.id)]);
    await fetchListings(nextCity);
    return createdListing;
  }, [appliedCity, fetchListings]);

  const value = useMemo(
    () => ({
      jobListings,
      workerListings,
      isLoading,
      error,
      availableCities,
      selectedCity,
      appliedCity,
      setCityFilter,
      fetchListings,
      refreshListings,
      addJobListing,
      addWorkerListing,
    }),
    [jobListings, workerListings, isLoading, error, availableCities, selectedCity, appliedCity, setCityFilter, fetchListings, refreshListings, addJobListing, addWorkerListing],
  );

  return <ListingContext.Provider value={value}>{children}</ListingContext.Provider>;
}

export function useListings() {
  const context = useContext(ListingContext);
  if (!context) throw new Error('useListings must be used inside a ListingProvider');
  return context;
}
