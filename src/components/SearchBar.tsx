import { useState, useRef, useEffect } from 'react';

interface NominatimResult {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
}

interface SearchBarProps {
  onLocationSelect: (lat: number, lng: number, label: string) => void;
  showLabel?: boolean;
}

const QUICK_PICKS = [
  { label: '全港',   sublabel: 'Hong Kong — All Districts', lat: 22.3193, lng: 114.1694 },
  { label: '港島',   sublabel: 'Hong Kong Island',          lat: 22.2779, lng: 114.1588 },
  { label: '九龍',   sublabel: 'Kowloon',                   lat: 22.3271, lng: 114.1740 },
  { label: '新界',   sublabel: 'New Territories',           lat: 22.4077, lng: 114.1096 },
  { label: '離島',   sublabel: 'Outlying Islands',          lat: 22.2361, lng: 113.9361 },
];

const HOT_DISTRICTS = [
  { label: '銅鑼灣', lat: 22.2793, lng: 114.1827 },
  { label: '旺角',   lat: 22.3138, lng: 114.1700 },
  { label: '九龍塘', lat: 22.3398, lng: 114.1745 },
  { label: '沙田',   lat: 22.3825, lng: 114.1877 },
  { label: '荃灣',   lat: 22.3714, lng: 114.1185 },
  { label: '將軍澳', lat: 22.3072, lng: 114.2608 },
];

export default function SearchBar({ onLocationSelect, showLabel = true }: SearchBarProps) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<NominatimResult[]>([]);
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const inputRef    = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef    = useRef<AbortController | null>(null);

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  function handleInput(q: string) {
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(true); // keep open to show quick picks
      return;
    }
    timerRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ' Hong Kong')}&format=json&limit=7&addressdetails=1`,
          { headers: { 'Accept-Language': 'zh-TW,zh,en' }, signal: abortRef.current.signal }
        );
        const data = await res.json() as NominatimResult[];
        setResults(data);
        setOpen(true);
      } catch { /* aborted */ } finally {
        setLoading(false);
      }
    }, 400);
  }

  function selectResult(lat: number, lng: number, label: string, short: string) {
    setQuery(short);
    setOpen(false);
    setResults([]);
    onLocationSelect(lat, lng, label);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length > 0) {
      const r = results[0];
      const short = r.name || r.display_name.split(',')[0].trim();
      selectResult(parseFloat(r.lat), parseFloat(r.lon), r.display_name, short);
    } else if (!query.trim()) {
      // Empty → pan to HK overview
      onLocationSelect(22.3193, 114.1694, '全港');
      setOpen(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
  }

  const showQuickPicks = open && query.trim().length < 2;
  const showResults    = open && results.length > 0 && query.trim().length >= 2;

  return (
    <div className="relative" ref={containerRef}>
      <form
        onSubmit={handleSubmit}
        id="search-bar"
        className="flex items-center border border-border rounded-pill shadow-sm bg-white overflow-hidden transition-shadow focus-within:shadow-md"
      >
        {/* Input section */}
        <div className="flex flex-col px-5 py-[10px] flex-1 min-w-0">
          {showLabel && <span className="text-xs font-bold text-t1 whitespace-nowrap mb-0.5">Where</span>}
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              className="text-sm text-t2 w-full outline-none bg-transparent placeholder:text-t3"
              placeholder="搜尋地區或屋苑..."
              value={query}
              onChange={e => handleInput(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {loading && (
              <div className="w-3 h-3 border-2 border-border border-t-slate rounded-full animate-spin flex-shrink-0" />
            )}
            {!loading && query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setResults([]); setOpen(true); inputRef.current?.focus(); }}
                className="text-t3 hover:text-t1 flex-shrink-0 w-4 h-4 rounded-full border border-border flex items-center justify-center text-[10px]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="w-px h-7 bg-border flex-shrink-0" />

        {/* CTA */}
        <div className="px-3 py-[10px]">
          <button
            type="submit"
            id="search-cta"
            className="btn-lift flex items-center gap-2 px-4 py-[9px] bg-slate text-lime rounded-pill text-sm font-bold hover:bg-slate-mid transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Search
          </button>
        </div>
      </form>

      {/* ── Dropdown ─────────────────────────────────────────────────────── */}
      {(showQuickPicks || showResults) && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl border border-border shadow-[0_8px_32px_rgba(15,23,42,0.13)] z-[300] overflow-hidden">

          {/* Quick picks (empty input) */}
          {showQuickPicks && (
            <>
              <div className="px-4 pt-4 pb-2">
                <p className="text-xs font-bold text-t3 uppercase tracking-wider mb-3">探索香港</p>
                <ul className="divide-y divide-border/60">
                  {QUICK_PICKS.map(p => (
                    <li key={p.label}>
                      <button
                        type="button"
                        onClick={() => selectResult(p.lat, p.lng, p.sublabel, p.label)}
                        className="w-full flex items-center gap-3 py-2.5 px-1 hover:bg-off-white rounded-lg transition-colors text-left"
                      >
                        <span className="w-8 h-8 rounded-xl bg-lime-soft flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 24 24" fill="none" width="14" height="14" className="text-slate">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8"/>
                            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
                          </svg>
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-t1">{p.label}</p>
                          <p className="text-xs text-t3">{p.sublabel}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-4 pb-4 border-t border-border pt-3">
                <p className="text-xs font-bold text-t3 uppercase tracking-wider mb-2.5">熱門地區</p>
                <div className="flex flex-wrap gap-2">
                  {HOT_DISTRICTS.map(d => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => selectResult(d.lat, d.lng, d.label, d.label)}
                      className="px-3 py-1.5 bg-off-white hover:bg-lime-soft hover:text-slate border border-border rounded-pill text-xs font-medium text-t2 transition-all"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Nominatim results */}
          {showResults && (
            <ul className="max-h-64 overflow-y-auto py-1.5">
              {results.map(r => {
                const short = r.name || r.display_name.split(',')[0].trim();
                const parts  = r.display_name.split(',');
                const sub    = parts.slice(1, 3).join(',').trim();
                return (
                  <li key={r.place_id}>
                    <button
                      type="button"
                      onClick={() => selectResult(parseFloat(r.lat), parseFloat(r.lon), r.display_name, short)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-off-white transition-colors text-left"
                    >
                      <span className="w-7 h-7 rounded-lg bg-off-white flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" width="13" height="13" className="text-t3">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8"/>
                          <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-t1 truncate">{short}</p>
                        {sub && <p className="text-xs text-t3 truncate">{sub}</p>}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
