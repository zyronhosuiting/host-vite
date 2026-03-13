import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { LISTINGS } from '../data/listings';
import type { Listing } from '../types';

export function useListings() {
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [loaded, setLoaded] = useState(false);

  // Fetch listings from backend on mount
  useEffect(() => {
    let cancelled = false;

    api.get<Listing[]>('/listings')
      .then(({ data }) => {
        if (cancelled) return;
        setListings(data);
        setLoaded(true);
      })
      .catch(() => {
        // Fallback to local data if API is unavailable
        if (!cancelled) setLoaded(true);
      });

    return () => { cancelled = true; };
  }, []);

  const updateListing = useCallback(async (listing: Listing) => {
    try {
      const { data } = await api.patch<Listing>(`/listings/${listing.id}`, listing);
      setListings((prev) => prev.map((l) => (l.id === data.id ? data : l)));
    } catch {
      // Fallback: update locally
      setListings((prev) => prev.map((l) => (l.id === listing.id ? listing : l)));
    }
  }, []);

  const createListing = useCallback(async (listing: Listing) => {
    try {
      const { data } = await api.post<Listing>('/listings', listing);
      setListings((prev) => [...prev, data]);
    } catch {
      // Fallback: create locally
      setListings((prev) => [...prev, listing]);
    }
  }, []);

  const deleteListing = useCallback(async (id: number) => {
    try {
      await api.delete(`/listings/${id}`);
    } catch {
      // continue with local delete even if API fails
    }
    setListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { listings, loaded, updateListing, createListing, deleteListing };
}
