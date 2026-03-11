import { useState, useCallback } from 'react';

export function useMapToggle(initial = false) {
  const [mapVisible, setMapVisible] = useState(initial);

  const showMap = useCallback(() => setMapVisible(true), []);
  const hideMap = useCallback(() => setMapVisible(false), []);
  const toggle  = useCallback(() => setMapVisible(v => !v), []);

  return { mapVisible, showMap, hideMap, toggle };
}
