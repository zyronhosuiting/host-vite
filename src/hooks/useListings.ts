import { useState } from 'react';
import { LISTINGS } from '../data/listings';
import detailExtras from '../data/detailExtras';
import type { Listing, ListingExtra } from '../types';

const LS_LISTINGS = 'hl_listings';
const LS_EXTRAS   = 'hl_extras';
const LS_VERSION  = 'hl_version';
const DATA_VERSION = '3'; // bump when default data changes

function loadListings(): Listing[] {
  try {
    if (localStorage.getItem(LS_VERSION) !== DATA_VERSION) {
      localStorage.removeItem(LS_LISTINGS);
      localStorage.removeItem(LS_EXTRAS);
      localStorage.setItem(LS_VERSION, DATA_VERSION);
    }
    const raw = localStorage.getItem(LS_LISTINGS);
    return raw ? (JSON.parse(raw) as Listing[]) : LISTINGS;
  } catch {
    return LISTINGS;
  }
}

function loadExtras(): Record<number, ListingExtra> {
  try {
    const raw = localStorage.getItem(LS_EXTRAS);
    return raw ? (JSON.parse(raw) as Record<number, ListingExtra>) : detailExtras;
  } catch {
    return detailExtras;
  }
}

export function useListings() {
  const [listings, setListings] = useState<Listing[]>(loadListings);
  const [extras, setExtras] = useState<Record<number, ListingExtra>>(loadExtras);

  function persistListings(next: Listing[]) {
    setListings(next);
    localStorage.setItem(LS_LISTINGS, JSON.stringify(next));
  }

  function persistExtras(next: Record<number, ListingExtra>) {
    setExtras(next);
    localStorage.setItem(LS_EXTRAS, JSON.stringify(next));
  }

  function updateListing(listing: Listing, extra: ListingExtra) {
    persistListings(listings.map(l => l.id === listing.id ? listing : l));
    persistExtras({ ...extras, [listing.id]: extra });
  }

  function createListing(listing: Listing, extra: ListingExtra) {
    persistListings([...listings, listing]);
    persistExtras({ ...extras, [listing.id]: extra });
  }

  function deleteListing(id: number) {
    persistListings(listings.filter(l => l.id !== id));
    const next = { ...extras };
    delete next[id];
    persistExtras(next);
  }

  return { listings, extras, updateListing, createListing, deleteListing };
}
