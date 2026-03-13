import { useState, useEffect } from 'react';
import { api } from '../api/client';
import type { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;

    api.get<Category[]>('/categories')
      .then(({ data }) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => { /* API unavailable */ });

    return () => { cancelled = true; };
  }, []);

  return categories;
}
