import { useState, useMemo } from 'react';
import type { FilterState, Listing } from '../types';

export const DEFAULT_FILTERS: FilterState = {
  propertyType: new Set(),
  minPrice: 0,
  maxPrice: 0,
  districts: new Set(),
  bedrooms: 0,
  bathrooms: 0,
  areaRange: '',
  floorLevel: new Set(),
  buildingAge: '',
  mtrDistance: '',
  moveIn: '',
  leaseTerm: new Set(),
  amenities: new Set(),
  minPricePerSqft: 0,
  maxPricePerSqft: 0,
};

// Map property type keys → listing category keys
const PROPERTY_TYPE_CAT_MAP: Record<string, string[]> = {
  apartment:  ['estate', 'luxury'],
  studio:     ['tong', 'estate'],
  room:       ['tong'],
  village:    ['village', 'house'],
  serviced:   ['luxury', 'commercial'],
};

function parseAreaRange(key: string): [number, number] {
  if (key === '800+') return [800, Infinity];
  const [lo, hi] = key.split('-').map(Number);
  return [lo, hi];
}

export function countActive(f: FilterState): number {
  let n = 0;
  if (f.propertyType.size) n++;
  if (f.minPrice > 0 || f.maxPrice > 0) n++;
  if (f.districts.size) n++;
  if (f.bedrooms) n++;
  if (f.bathrooms > 0) n++;
  if (f.areaRange) n++;
  if (f.floorLevel.size) n++;
  if (f.buildingAge) n++;
  if (f.mtrDistance) n++;
  if (f.moveIn) n++;
  if (f.leaseTerm.size) n++;
  if (f.amenities.size) n++;
  if (f.minPricePerSqft > 0 || f.maxPricePerSqft > 0) n++;
  return n;
}

export function useFilter(allListings: Listing[]) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filteredListings = useMemo<Listing[]>(() => {
    return allListings.filter(l => {
      const cats = l.categories;

      // Category bar
      if (activeCategory !== 'all' && !cats.includes(activeCategory)) return false;

      // Price range
      if (filters.minPrice > 0 && l.price < filters.minPrice) return false;
      if (filters.maxPrice > 0 && l.price > filters.maxPrice) return false;

      // Property type (OR match)
      if (filters.propertyType.size > 0) {
        const matchedCats = [...filters.propertyType].flatMap(pt => PROPERTY_TYPE_CAT_MAP[pt] ?? []);
        if (!matchedCats.some(c => cats.includes(c))) return false;
      }

      // District (partial match on listing.location)
      if (filters.districts.size > 0) {
        const locLower = l.location.toLowerCase();
        const matched = [...filters.districts].some(d => locLower.includes(d.toLowerCase()));
        if (!matched) return false;
      }

      // Bedrooms (min)
      if (filters.bedrooms > 0) {
        if (l.bedrooms < filters.bedrooms) return false;
      }

      // Bathrooms (min)
      if (filters.bathrooms > 0) {
        if (l.bathrooms < filters.bathrooms) return false;
      }

      // Area range
      if (filters.areaRange) {
        const [lo, hi] = parseAreaRange(filters.areaRange);
        if (l.area < lo || l.area > hi) return false;
      }

      // Move-in date: show listings available on or before the picked date
      if (filters.moveIn) {
        const picked = new Date(filters.moveIn);
        picked.setHours(0, 0, 0, 0);
        if (l.availableDates.includes('即時')) {
          // immediately available — always passes
        } else {
          const m = l.availableDates.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
          if (m) {
            const available = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
            if (available > picked) return false;
          }
        }
      }

      // Lease term
      if (filters.leaseTerm.size > 0 && l.leaseTerm) {
        const lt = l.leaseTerm;
        const matched = [...filters.leaseTerm].some(key => {
          if (key === '12months') return lt.includes('12');
          if (key === 'flexible') return lt.includes('彈') || lt.includes('靈活');
          if (key === 'shortterm') return lt.includes('短');
          return false;
        });
        if (!matched) return false;
      }

      // Amenities (must have ALL selected)
      if (filters.amenities.size > 0) {
        const have = new Set(l.amenities ?? []);
        const allPresent = [...filters.amenities].every(a => have.has(a));
        if (!allPresent) return false;
      }

      // Price per sqft
      if ((filters.minPricePerSqft > 0 || filters.maxPricePerSqft > 0) && l.area > 0) {
        const pps = l.price / l.area;
        if (filters.minPricePerSqft > 0 && pps < filters.minPricePerSqft) return false;
        if (filters.maxPricePerSqft > 0 && pps > filters.maxPricePerSqft) return false;
      }

      return true;
    });
  }, [allListings, activeCategory, filters]);

  const activeFilterCount = countActive(filters);

  function resetFilters() {
    setFilters({
      ...DEFAULT_FILTERS,
      propertyType: new Set(),
      districts: new Set(),
      floorLevel: new Set(),
      leaseTerm: new Set(),
      amenities: new Set(),
      minPricePerSqft: 0,
      maxPricePerSqft: 0,
    });
    setActiveCategory('all');
  }

  return {
    activeCategory, setActiveCategory,
    filters, setFilters,
    filteredListings,
    activeFilterCount,
    resetFilters,
  };
}
