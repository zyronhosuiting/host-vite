import { useState, useCallback } from 'react';
import { LISTINGS } from '../data/listings';

const STORAGE_KEY = 'hl_saved';

function getInitialIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as number[];
  } catch {
    // ignore parse errors
  }
  return LISTINGS.filter(l => l.saved).map(l => l.id);
}

export function useFavorites() {
  const [savedIds, setSavedIds] = useState<number[]>(getInitialIds);

  const isSaved = useCallback((id: number) => savedIds.includes(id), [savedIds]);

  const toggle = useCallback((id: number) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return { savedIds, isSaved, toggle };
}
