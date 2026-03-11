interface MapPillProps {
  mapVisible: boolean;
  onToggle: () => void;
}

export default function MapPill({ mapVisible, onToggle }: MapPillProps) {
  return (
    <button
      id="map-pill"
      onClick={onToggle}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-slate text-lime rounded-pill text-sm font-semibold hover:bg-slate-mid hover:-translate-y-0.5 transition-all duration-150 shadow-[0_8px_28px_rgba(17,24,39,0.45)] md:hidden"
    >
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
        <path d="M9 20L3 17V4l6 3m0 13l6-3m-6 3V7m6 10l6 3V7l-6-3m0 13V4"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span id="map-pill-label">{mapVisible ? 'Hide map' : 'Show map'}</span>
    </button>
  );
}
