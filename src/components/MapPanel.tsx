import { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import L from 'leaflet';
import type { Listing, MapBounds } from '../types';
import MapMarkerPopup from './MapMarkerPopup';

interface MapPanelProps {
  listings: Listing[];
  visible: boolean;
  onHighlight?: (id: number | null) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  searchLocation?: { latitude: number; longitude: number } | null;
  onMobileClose?: () => void;
  onNavigate?: (id: number) => void;
}

export default function MapPanel({ listings, visible, onHighlight, onBoundsChange, searchLocation, onMobileClose, onNavigate }: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const onBoundsChangeRef = useRef(onBoundsChange);
  onBoundsChangeRef.current = onBoundsChange;
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: true });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const markerRefs: L.Marker[] = [];
    const popupRoots: Root[] = [];

    listings.forEach(listing => {
      const el = document.createElement('div');
      el.className = 'map-marker';
      el.textContent = `$${listing.price.toLocaleString()}`;

      const icon = L.divIcon({
        html: el.outerHTML,
        className: 'map-marker-wrap',
        iconAnchor: [0, 0],
        popupAnchor: [0, -8],
      });

      // Use a live React root so hover/carousel state works inside the popup
      const popupContainer = document.createElement('div');
      const popupRoot = createRoot(popupContainer);
      popupRoot.render(<MapMarkerPopup listing={listing} />);
      popupRoots.push(popupRoot);

      const marker = L.marker([listing.latitude, listing.longitude], { icon })
        .addTo(map)
        .bindPopup(popupContainer, { maxWidth: 260, closeButton: false });

      markerRefs.push(marker);

      marker.on('click', () => {
        document.querySelectorAll<HTMLElement>('.map-marker').forEach(m => m.classList.remove('map-marker--active'));
        marker.getElement()?.querySelector<HTMLElement>('.map-marker')?.classList.add('map-marker--active');
        onHighlight?.(listing.id);
      });
      marker.on('popupopen', () => {
        const popupEl = marker.getPopup()?.getElement();
        if (popupEl) {
          popupEl.style.cursor = 'pointer';
          const handler = () => onNavigateRef.current?.(listing.id);
          popupEl.addEventListener('click', handler);
          marker.once('popupclose', () => popupEl.removeEventListener('click', handler));
        }
      });
      marker.on('popupclose', () => {
        marker.getElement()?.querySelector<HTMLElement>('.map-marker')?.classList.remove('map-marker--active');
        onHighlight?.(null);
      });
    });

    function emitBounds() {
      const b = map.getBounds();
      onBoundsChangeRef.current?.({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    }

    map.on('moveend', emitBounds);

    // Always default to Hong Kong
    map.setView([22.3193, 114.1694], 13);
    emitBounds();

    mapRef.current = map;

    return () => {
      popupRoots.forEach(r => { try { r.unmount(); } catch { /* ignore */ } });
      map.remove();
      mapRef.current = null;
    };
  }, [listings, onHighlight]);

  useEffect(() => {
    if (visible && mapRef.current) {
      setTimeout(() => mapRef.current?.invalidateSize(), 300);
    }
  }, [visible]);

  // Fly to searched location
  useEffect(() => {
    if (searchLocation && mapRef.current) {
      mapRef.current.flyTo([searchLocation.latitude, searchLocation.longitude], 15, { duration: 1.0 });
    }
  }, [searchLocation]);

  return (
    <div
      className={`flex flex-col flex-shrink-0 transition-all duration-300 ${
        visible
          ? 'fixed inset-0 z-[200] md:static md:inset-auto md:sticky md:top-[150px] md:h-[calc(100vh-150px)] md:w-[45%] md:opacity-100'
          : 'hidden md:flex md:w-0 md:opacity-0 md:overflow-hidden md:sticky md:top-[150px] md:h-[calc(100vh-150px)]'
      }`}
    >
      {/* Mobile close bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-border md:hidden flex-shrink-0">
        <span className="text-sm font-semibold text-t1">地圖</span>
        <button
          onClick={onMobileClose}
          className="w-8 h-8 rounded-full bg-off-white flex items-center justify-center text-t2"
          aria-label="Close map"
        >
          <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  );
}
