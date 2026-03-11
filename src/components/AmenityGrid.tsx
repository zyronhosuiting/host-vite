const AMENITIES = [
  { key: 'elevator', icon: '🛗', label: '升降機' },
  { key: 'gym',      icon: '🏋️', label: '健身室' },
  { key: 'pool',     icon: '🏊', label: '游泳池' },
  { key: 'balcony',  icon: '🌅', label: '露台' },
  { key: 'parking',  icon: '🚗', label: '車位' },
  { key: 'pets',     icon: '🐾', label: '可養寵物' },
  { key: 'security', icon: '🔒', label: '保安' },
];

interface AmenityGridProps {
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
  readOnly?: boolean;
}

export default function AmenityGrid({ selected, onChange, readOnly = false }: AmenityGridProps) {
  function toggle(key: string) {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    onChange(next);
  }

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {AMENITIES.filter(a => readOnly ? selected.has(a.key) : true).map(a => (
        <label
          key={a.key}
          className={`flex flex-col items-center gap-1.5 border rounded-2xl p-4 text-xs font-medium transition-all ${
            readOnly
              ? 'bg-off-white border-border text-t1 cursor-default hover:border-border-dark'
              : selected.has(a.key)
                ? 'border-slate bg-slate text-lime shadow-sm cursor-pointer'
                : 'bg-[#f3f4f6] border-[#d1d5db] text-t2 cursor-pointer hover:bg-lime-soft hover:border-lime/50 hover:text-slate'
          }`}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={selected.has(a.key)}
            onChange={() => !readOnly && toggle(a.key)}
            readOnly={readOnly}
          />
          <span className="text-lg">{a.icon}</span>
          {a.label}
        </label>
      ))}
    </div>
  );
}
