import { useState, useCallback, useEffect } from 'react';
import { api, getToken } from '../api/client';

const STORAGE_KEY = 'hl_saved';

function getLocalIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as number[];
  } catch { /* ignore */ }
  return [];
}

export function useFavorites() {
  const [savedIds, setSavedIds] = useState<number[]>(getLocalIds);

  // Fetch from API if logged in
  useEffect(() => {
    if (!getToken()) return;
    api.get<number[]>('/favorites/ids')
      .then(({ data }) => {
        setSavedIds(data);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
      })
      .catch(() => { /* fallback to local */ });
  }, []);

  const isSaved = useCallback((id: number) => savedIds.includes(id), [savedIds]);

  const toggle = useCallback((id: number) => {
    // Optimistic update
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });

    // Call API if logged in
    if (getToken()) {
      api.post(`/favorites/${id}`).catch(() => { /* revert on error if needed */ });
    }
  }, []);

  return { savedIds, isSaved, toggle };
}
