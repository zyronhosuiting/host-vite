import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import ListingGrid from '../components/ListingGrid';
import MapPanel from '../components/MapPanel';
import MapPill from '../components/MapPill';
import FilterModal from '../components/FilterModal';
import AnnotationOverlay from '../components/AnnotationOverlay';
import SiteFooter from '../components/SiteFooter';
import { useFilter } from '../hooks/useFilter';
import { useMapToggle } from '../hooks/useMapToggle';
import { useListings } from '../hooks/useListings';
import type { MapBounds } from '../types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { listings } = useListings();
  const { activeCategory, setActiveCategory, filters, setFilters, filteredListings, activeFilterCount, resetFilters } = useFilter(listings);
  // Map visible by default
  const { mapVisible, toggle: toggleMap } = useMapToggle(true);
  const [filterOpen, setFilterOpen]   = useState(false);
  const [guideVisible, setGuideVisible] = useState(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [searchLocation, setSearchLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Apply location from URL params (navigated from another page)
  useEffect(() => {
    const latitude = parseFloat(searchParams.get('latitude') ?? searchParams.get('lat') ?? '');
    const longitude = parseFloat(searchParams.get('longitude') ?? searchParams.get('lng') ?? '');
    if (!isNaN(latitude) && !isNaN(longitude)) {
      setSearchLocation({ latitude, longitude });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gridListings = (mapVisible && mapBounds)
    ? filteredListings.filter(l =>
        l.latitude >= mapBounds.south && l.latitude <= mapBounds.north &&
        l.longitude >= mapBounds.west  && l.longitude <= mapBounds.east
      )
    : filteredListings;

  function handleLocationSelect(lat: number, lng: number, _label: string) {
    setSearchLocation({ latitude: lat, longitude: lng });
    // Open map if it's hidden
    if (!mapVisible) toggleMap();
  }

  return (
    <div className="min-h-screen bg-off-white">
      <AnnotationOverlay visible={guideVisible} onClose={() => setGuideVisible(false)} />

      <SiteHeader
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        mapVisible={mapVisible}
        onToggleMap={toggleMap}
        onFilterOpen={() => setFilterOpen(true)}
        filterCount={activeFilterCount}
        onGuideOpen={() => setGuideVisible(true)}
        onLocationSelect={handleLocationSelect}
        fullWidth
      />

      <div id="page-body" className={`flex ${mapVisible ? 'items-start' : ''}`}>
        <ListingGrid listings={gridListings} highlightedId={highlightedId ?? undefined} mapVisible={mapVisible} onReset={resetFilters} />
        <MapPanel
          listings={filteredListings}
          visible={mapVisible}
          onHighlight={setHighlightedId}
          onBoundsChange={setMapBounds}
          searchLocation={searchLocation}
          onMobileClose={toggleMap}
          onNavigate={id => navigate(`/property/${id}`)}
        />
      </div>

      <MapPill mapVisible={mapVisible} onToggle={toggleMap} />

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        listings={listings}
      />

      <SiteFooter />
    </div>
  );
}
