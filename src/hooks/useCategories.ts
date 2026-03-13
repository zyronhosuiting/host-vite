import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { CATEGORIES as FALLBACK } from '../data/listings';
import type { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;

    api.get<Category[]>('/categories')
      .then(({ data }) => {
        if (!cancelled && data.length > 0) setCategories(data);
      })
      .catch(() => { /* keep fallback */ });

    return () => { cancelled = true; };
  }, []);

  return categories;
}
