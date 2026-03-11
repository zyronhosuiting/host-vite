import { useMemo } from 'react';
import type { Listing } from '../types';

const MIN_BUCKETS = 8;

function niceMax(val: number, round: number): number {
  return Math.ceil(val / round) * round;
}

function niceMin(val: number, round: number): number {
  return Math.floor(val / round) * round;
}

interface Props {
  listings: Listing[];
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void;
  values?: number[];      // overrides listings.map(l => l.price)
  step?: number;          // slider step, default 1000
  niceRound?: number;     // rounding interval for min/max, default 5000
  suffix?: string;        // label suffix, e.g. '/呎'
}

export default function PriceHistogramSlider({ listings, minPrice, maxPrice, onChange, values, step = 1000, niceRound = 5000, suffix = '' }: Props) {
  // Derive global range from actual listing data
  const { globalMin, globalMax, buckets, histogram } = useMemo(() => {
    const prices = values ?? listings.map(l => l.price);
    if (prices.length === 0) {
      return { globalMin: 0, globalMax: 100 * niceRound, buckets: MIN_BUCKETS, histogram: new Array(MIN_BUCKETS).fill(0) };
    }
    const dataMin = Math.min(...prices);
    const dataMax = Math.max(...prices);
    const gMin = niceMin(dataMin, niceRound);
    const gMax = niceMax(dataMax, niceRound);

    // Use enough buckets to show shape, minimum 8
    const buckets = Math.max(MIN_BUCKETS, prices.length * 2);
    const bucketSize = (gMax - gMin) / buckets;
    const histogram = new Array(buckets).fill(0);
    for (const p of prices) {
      const idx = Math.min(Math.floor((p - gMin) / bucketSize), buckets - 1);
      if (idx >= 0) histogram[idx]++;
    }
    return { globalMin: gMin, globalMax: gMax, buckets, histogram };
  }, [listings, values, niceRound]);

  const lo = minPrice > 0 ? minPrice : globalMin;
  const hi = maxPrice > 0 ? maxPrice : globalMax;

  const range = globalMax - globalMin;
  const loPercent = range > 0 ? ((lo - globalMin) / range) * 100 : 0;
  const hiPercent = range > 0 ? ((hi - globalMin) / range) * 100 : 100;

  const maxCount = Math.max(...histogram, 1);
  const bucketSize = range / buckets;

  function handleMin(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val < hi) onChange(val <= globalMin ? 0 : val, maxPrice);
  }

  function handleMax(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val > lo) onChange(minPrice, val >= globalMax ? 0 : val);
  }

  return (
    <div className="select-none">
      {/* Histogram bars */}
      <div className="flex items-end gap-px h-20 mb-2">
        {histogram.map((count, i) => {
          const bucketLo = globalMin + i * bucketSize;
          const bucketHi = bucketLo + bucketSize;
          const inRange = bucketLo < hi && bucketHi > lo;
          const heightPct = Math.max((count / maxCount) * 100, count > 0 ? 8 : 3);
          return (
            <div
              key={i}
              className="flex-1 rounded-sm transition-colors duration-150"
              style={{
                height: `${heightPct}%`,
                backgroundColor: inRange ? '#111827' : '#d1d5db',
              }}
            />
          );
        })}
      </div>

      {/* Dual range slider */}
      <div className="relative h-5 mb-5">
        {/* Track background */}
        <div className="absolute inset-y-0 flex items-center w-full">
          <div className="w-full h-[3px] bg-[#d1d5db] rounded-full" />
        </div>
        {/* Active track fill */}
        <div
          className="absolute inset-y-0 flex items-center pointer-events-none"
          style={{ left: `${loPercent}%`, right: `${100 - hiPercent}%` }}
        >
          <div className="w-full h-[3px] bg-slate rounded-full" />
        </div>

        {/* Min input */}
        <input
          type="range"
          min={globalMin}
          max={globalMax}
          step={step}
          value={lo}
          onChange={handleMin}
          className="range-thumb absolute inset-0 w-full opacity-0"
          style={{ zIndex: 3 }}
        />
        {/* Max input */}
        <input
          type="range"
          min={globalMin}
          max={globalMax}
          step={step}
          value={hi}
          onChange={handleMax}
          className="range-thumb absolute inset-0 w-full opacity-0"
          style={{ zIndex: 3 }}
        />

        {/* Visual thumb circles */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border border-[#bbb] rounded-full shadow-md pointer-events-none"
          style={{ left: `${loPercent}%`, zIndex: 6 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border border-[#bbb] rounded-full shadow-md pointer-events-none"
          style={{ left: `${hiPercent}%`, zIndex: 6 }}
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between gap-3">
        <div className="flex-1 border border-border rounded-xl px-4 py-2.5">
          <p className="text-xs text-t3 mb-0.5">最低</p>
          <p className="text-sm font-semibold text-t1">HK${lo.toLocaleString()}{suffix}</p>
        </div>
        <div className="flex-1 border border-border rounded-xl px-4 py-2.5 text-right">
          <p className="text-xs text-t3 mb-0.5">最高</p>
          <p className="text-sm font-semibold text-t1">
            HK${hi.toLocaleString()}{suffix}{hi >= globalMax ? '+' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
