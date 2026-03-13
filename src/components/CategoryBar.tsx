import type { Category } from '../types';
import CategoryItem from './CategoryItem';

interface CategoryBarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (key: string) => void;
  mapVisible: boolean;
  onToggleMap: () => void;
  onFilterOpen: () => void;
  onGuideOpen: () => void;
}

export default function CategoryBar({
  categories,
  activeCategory,
  onCategoryChange,
  mapVisible,
  onToggleMap,
  onFilterOpen,
  onGuideOpen,
}: CategoryBarProps) {
  return (
    <div className="border-t border-border bg-white flex items-center gap-4 px-3 sm:px-6 h-[72px] sm:h-[68px]">
      <div id="cat-strip" className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-none flex-1">
        {categories.map(cat => (
          <CategoryItem
            key={cat.key}
            cat={cat}
            active={activeCategory === cat.key}
            onClick={() => onCategoryChange(cat.key)}
          />
        ))}
      </div>
      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        <button
          id="filter-btn"
          onClick={onFilterOpen}
          className="flex items-center gap-[6px] px-[14px] py-2 border border-border-dark rounded-xl text-sm font-semibold text-t1 hover:bg-off-white hover:shadow-sm transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
            <path d="M3 7h18M6 12h12M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Filters
        </button>
        <div id="view-toggle" className="flex items-center border border-border rounded-md overflow-hidden">
          <button
            id="grid-btn"
            onClick={() => mapVisible && onToggleMap()}
            className={`flex items-center gap-[6px] px-3 py-2 text-sm font-medium transition-colors ${
              !mapVisible ? 'bg-slate text-lime' : 'text-t2 hover:bg-off-white'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
              <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
              <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
              <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
              <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
            </svg>
            Grid
          </button>
          <button
            id="map-btn"
            onClick={() => !mapVisible && onToggleMap()}
            className={`flex items-center gap-[6px] px-3 py-2 text-sm font-medium transition-colors ${
              mapVisible ? 'bg-slate text-lime' : 'text-t2 hover:bg-off-white'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
              <path d="M9 20L3 17V4l6 3m0 13l6-3m-6 3V7m6 10l6 3V7l-6-3m0 13V4"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Map
          </button>
        </div>
        <button
          id="guide-btn"
          onClick={onGuideOpen}
          className="flex items-center gap-[6px] px-3 py-2 text-sm font-medium text-t3 hover:text-t1 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8v.01M12 11v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          UI Guide
        </button>
      </div>
    </div>
  );
}
