import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { mapListing, toBackendListing, type BackendListing } from '../api/mappers';
import { LISTINGS } from '../data/listings';
import detailExtras from '../data/detailExtras';
import type { Listing, ListingExtra } from '../types';

export function useListings() {
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [extras, setExtras] = useState<Record<number, ListingExtra>>(detailExtras);
  const [loaded, setLoaded] = useState(false);

  // Fetch listings from backend on mount
  useEffect(() => {
    let cancelled = false;

    api.get<BackendListing[]>('/listings')
      .then(({ data }) => {
        if (cancelled) return;
        const mapped = data.map(mapListing);
        setListings(mapped.map((m) => m.listing));
        const extrasMap: Record<number, ListingExtra> = {};
        mapped.forEach((m) => { extrasMap[m.listing.id] = m.extra; });
        setExtras(extrasMap);
        setLoaded(true);
      })
      .catch(() => {
        // Fallback to local data if API is unavailable
        if (!cancelled) setLoaded(true);
      });

    return () => { cancelled = true; };
  }, []);

  const updateListing = useCallback(async (listing: Listing, extra: ListingExtra) => {
    const dto = toBackendListing(listing, extra);
    try {
      const { data } = await api.patch<BackendListing>(`/listings/${listing.id}`, dto);
      const { listing: updated, extra: updatedExtra } = mapListing(data);
      setListings((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setExtras((prev) => ({ ...prev, [updated.id]: updatedExtra }));
    } catch {
      // Fallback: update locally
      setListings((prev) => prev.map((l) => (l.id === listing.id ? listing : l)));
      setExtras((prev) => ({ ...prev, [listing.id]: extra }));
    }
  }, []);

  const createListing = useCallback(async (listing: Listing, extra: ListingExtra) => {
    const dto = toBackendListing(listing, extra);
    try {
      const { data } = await api.post<BackendListing>('/listings', dto);
      const { listing: created, extra: createdExtra } = mapListing(data);
      setListings((prev) => [...prev, created]);
      setExtras((prev) => ({ ...prev, [created.id]: createdExtra }));
    } catch {
      // Fallback: create locally
      setListings((prev) => [...prev, listing]);
      setExtras((prev) => ({ ...prev, [listing.id]: extra }));
    }
  }, []);

  const deleteListing = useCallback(async (id: number) => {
    try {
      await api.delete(`/listings/${id}`);
    } catch {
      // continue with local delete even if API fails
    }
    setListings((prev) => prev.filter((l) => l.id !== id));
    setExtras((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  return { listings, extras, loaded, updateListing, createListing, deleteListing };
}
