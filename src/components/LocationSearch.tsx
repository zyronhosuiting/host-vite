import { useState, useEffect, useRef } from 'react';

interface NominatimResult {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  value: string;
  onChange: (loc: string, mapLoc: string, lat: number, lng: number) => void;
}

export default function LocationSearch({ value, onChange }: LocationSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleInput(q: string) {
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }

    timerRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`,
          { headers: { 'Accept-Language': 'zh-TW,zh,en' }, signal: abortRef.current.signal }
        );
        const data = await res.json() as NominatimResult[];
        setResults(data);
        setOpen(true);
      } catch {
        // aborted or network error
      } finally {
        setLoading(false);
      }
    }, 500);
  }

  function select(r: NominatimResult) {
    const loc = r.display_name;
    const mapLoc = r.name || r.display_name.split(',')[0].trim();
    onChange(loc, mapLoc, parseFloat(r.lat), parseFloat(r.lon));
    setQuery(loc);
    setOpen(false);
    setResults([]);
  }

  const inputCls = 'w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-slate transition-colors bg-white';

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          className={inputCls}
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="輸入地址搜尋..."
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-border border-t-slate rounded-full animate-spin" />
          </div>
        )}
        {!loading && query && (
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-t3" viewBox="0 0 24 24" fill="none" width="14" height="14">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M16.5 16.5l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-[200] top-full mt-1 left-0 right-0 bg-white border border-border rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
          {results.map(r => {
            const short = r.name || r.display_name.split(',')[0].trim();
            return (
              <li key={r.place_id} className="border-b border-border last:border-0">
                <button
                  type="button"
                  onClick={() => select(r)}
                  className="w-full text-left px-4 py-2.5 hover:bg-off-white transition-colors flex items-start gap-3"
                >
                  <svg className="text-t3 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" width="14" height="14">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-t1 truncate">{short}</p>
                    <p className="text-xs text-t3 truncate">{r.display_name}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
