import { useMemo } from 'react';
import type { FilterState, Listing, ListingExtra } from '../types';
import { DEFAULT_FILTERS, countActive } from '../hooks/useFilter';
import FilterSection from './FilterSection';
import PriceStepper from './PriceStepper';
import AmenityGrid from './AmenityGrid';
import PriceHistogramSlider from './PriceHistogramSlider';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (next: FilterState) => void;
  listings?: Listing[];
  extras?: Record<number, ListingExtra>;
}

// ── Static option lists ───────────────────────────────────────────────────────

const HK_DISTRICTS = [
  '中西區', '灣仔', '東區', '南區',
  '九龍城', '觀塘', '深水埗', '黃大仙', '油尖旺',
  '葵青', '荃灣', '屯門', '元朗',
  '北區', '大埔', '沙田', '西貢', '離島',
];


const AREA_RANGES = [
  { key: '200-400', label: '200–400 呎' },
  { key: '400-600', label: '400–600 呎' },
  { key: '600-800', label: '600–800 呎' },
  { key: '800+',    label: '800 呎+' },
];





const LEASE_TERMS = [
  { key: '12months',  label: '12 個月' },
  { key: 'flexible',  label: '彈性租約' },
  { key: 'shortterm', label: '短租' },
];

// ── Helper components ─────────────────────────────────────────────────────────

const chipCls = (active: boolean) =>
  `px-3 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all whitespace-nowrap ${
    active
      ? 'bg-slate text-lime border-slate shadow-sm'
      : 'bg-[#f3f4f6] border-[#d1d5db] text-t2 hover:bg-lime-soft hover:border-lime/50 hover:text-slate'
  }`;

interface ChipRowProps {
  options: { key: string; label: string }[];
  selected: string;
  onSelect: (key: string) => void;
}
function ChipRow({ options, selected, onSelect }: ChipRowProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o.key} type="button" onClick={() => onSelect(o.key === selected ? '' : o.key)}
          className={chipCls(o.key === selected && o.key !== '')}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface MultiChipProps {
  options: { key: string; label: string }[];
  selected: Set<string>;
  onToggle: (key: string) => void;
}
function MultiChip({ options, selected, onToggle }: MultiChipProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o.key} type="button" onClick={() => onToggle(o.key)}
          className={chipCls(selected.has(o.key))}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FilterModal({ open, onClose, filters, onChange, listings = [], extras = {} }: FilterModalProps) {
  if (!open) return null;

  const activeCount = countActive(filters);

  // Pre-compute price-per-sqft values for histogram
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sqftValues = useMemo(
    () => listings
      .filter(l => extras[l.id]?.area > 0)
      .map(l => Math.round(l.price / extras[l.id].area)),
    [listings, extras]
  );

  function toggle<K extends 'propertyType' | 'districts' | 'floorLevel' | 'leaseTerm' | 'amenities'>(
    field: K, key: string
  ) {
    const next = new Set(filters[field] as Set<string>);
    if (next.has(key)) next.delete(key); else next.add(key);
    onChange({ ...filters, [field]: next });
  }

  function reset() {
    onChange({
      ...DEFAULT_FILTERS,
      propertyType: new Set(),
      districts: new Set(),
      floorLevel: new Set(),
      leaseTerm: new Set(),
      amenities: new Set(),
      minPricePerSqft: 0,
      maxPricePerSqft: 0,
    });
  }

  return (
    <div
      id="filter-modal"
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-off-white transition-colors text-t1 text-base">
            ✕
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-t1">篩選條件</span>
            {activeCount > 0 && (
              <span className="bg-slate text-lime text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <div className="w-8" />
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 divide-y divide-border">

          {/* 2. Monthly Rent */}
          <FilterSection title="每月租金" subtitle="港元 HKD">
            <PriceHistogramSlider
              listings={listings}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onChange={(min, max) => onChange({ ...filters, minPrice: min, maxPrice: max })}
            />
          </FilterSection>

          {/* 2b. Price per sqft */}
          <FilterSection title="平均呎價" subtitle="港元 HKD／呎">
            <PriceHistogramSlider
              listings={listings}
              values={sqftValues}
              minPrice={filters.minPricePerSqft}
              maxPrice={filters.maxPricePerSqft}
              onChange={(min, max) => onChange({ ...filters, minPricePerSqft: min, maxPricePerSqft: max })}
              step={1}
              niceRound={10}
              suffix="/呎"
            />
          </FilterSection>

          {/* 3. District */}
          <FilterSection title="地區" subtitle="可多選">
            <div className="grid grid-cols-4 gap-2">
              {HK_DISTRICTS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggle('districts', d)}
                  className={`py-2 px-2 rounded-xl border text-xs font-medium transition-all text-center ${
                    filters.districts.has(d)
                      ? 'bg-slate text-lime border-slate shadow-sm'
                      : 'bg-[#f3f4f6] border-[#d1d5db] text-t2 hover:bg-lime-soft hover:border-lime/50 hover:text-slate'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* 4. Bedrooms */}
          <FilterSection title="睡房數目">
            <PriceStepper
              label="睡房數目"
              value={filters.bedroomType}
              onChange={v => onChange({ ...filters, bedroomType: v })}
            />
          </FilterSection>

          {/* 6. Saleable Area */}
          <FilterSection title="實用面積">
            <ChipRow
              options={AREA_RANGES}
              selected={filters.areaRange}
              onSelect={key => onChange({ ...filters, areaRange: key })}
            />
          </FilterSection>

          {/* 11. Lease Term */}
          <FilterSection title="租約期">
            <MultiChip
              options={LEASE_TERMS}
              selected={filters.leaseTerm}
              onToggle={key => toggle('leaseTerm', key)}
            />
          </FilterSection>

          {/* 12. Amenities */}
          <FilterSection title="設施配套">
            <AmenityGrid
              selected={filters.amenities}
              onChange={amenities => onChange({ ...filters, amenities })}
            />
          </FilterSection>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0">
          <button
            type="button"
            onClick={reset}
            className="text-sm font-semibold text-t1 underline hover:no-underline"
          >
            清除全部
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-lift px-6 py-3 bg-slate text-lime rounded-pill text-sm font-bold hover:bg-slate-mid transition-colors"
          >
            顯示搜尋結果
          </button>
        </div>
      </div>
    </div>
  );
}
