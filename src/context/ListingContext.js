import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createJobListing,
  createWorkerListing,
  fetchJobListings,
  fetchWorkerListings,
} from '../api/listingsApi';

const ListingContext = createContext(null);

function fetchListingsFromApi() {
  return Promise.all([fetchJobListings(), fetchWorkerListings()]);
}

export function ListingProvider({ children }) {
  const [jobListings, setJobListings] = useState([]);
  const [workerListings, setWorkerListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshListings = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return fetchListingsFromApi()
      .then(([jobs, workers]) => {
        setJobListings(jobs);
        setWorkerListings(workers);
        setError(null);
      })
      .catch((loadError) => {
        setError(loadError.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let isActive = true;
    fetchListingsFromApi()
      .then(([jobs, workers]) => {
        if (!isActive) return;
        setJobListings(jobs);
        setWorkerListings(workers);
        setError(null);
      })
      .catch((loadError) => {
        if (isActive) setError(loadError.message);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const addJobListing = useCallback(async (listing) => {
    const createdListing = await createJobListing(listing);
    setJobListings((currentListings) => [createdListing, ...currentListings]);
    setError(null);
    return createdListing;
  }, []);

  const addWorkerListing = useCallback(async (listing) => {
    const createdListing = await createWorkerListing(listing);
    setWorkerListings((currentListings) => [createdListing, ...currentListings]);
    setError(null);
    return createdListing;
  }, []);

  const value = useMemo(
    () => ({
      jobListings,
      workerListings,
      isLoading,
      error,
      refreshListings,
      addJobListing,
      addWorkerListing,
    }),
    [jobListings, workerListings, isLoading, error, refreshListings, addJobListing, addWorkerListing],
  );

  return <ListingContext.Provider value={value}>{children}</ListingContext.Provider>;
}

export function useListings() {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListings must be used inside a ListingProvider');
  }
  return context;
}
