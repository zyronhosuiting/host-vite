import type { Listing } from '../types';
import ListingCard from './ListingCard';

interface ListingGridProps {
  listings: Listing[];
  highlightedId?: number;
  mapVisible?: boolean;
  onReset?: () => void;
}

export default function ListingGrid({ listings, highlightedId, mapVisible, onReset }: ListingGridProps) {
  return (
    <div className="flex-1 min-w-0 px-4 md:px-6 py-6 md:py-8 pb-28 md:pb-8">
      <p id="active-cat-label" className="text-sm font-semibold text-t2 mb-4 md:mb-6">
        {listings.length} 個房源
      </p>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-off-white border border-border flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" width="24" height="24" className="text-t3">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-t1 mb-1">找不到符合條件的房源</p>
            <p className="text-sm text-t3">試試調整篩選條件，或重設後重新搜尋</p>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="px-6 py-3 bg-slate text-lime rounded-pill text-sm font-bold hover:bg-slate-mid transition-colors"
            >
              重設篩選條件
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-4 md:gap-6 ${
          mapVisible
            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {listings.map((l, i) => (
            <div key={l.id} id={i === 0 ? 'first-card' : undefined}>
              <ListingCard listing={l} highlighted={l.id === highlightedId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
