import { useEffect } from 'react';

interface AnnotationOverlayProps {
  visible: boolean;
  onClose: () => void;
}

const ANNOTATIONS: Array<{ target: string; label: string; desc: string }> = [
  { target: 'logo',        label: '1', desc: 'Logo + home link' },
  { target: 'search-bar',  label: '2', desc: 'Search bar (4 fields)' },
  { target: 'search-cta',  label: '3', desc: 'Search CTA button' },
  { target: 'host-link',   label: '4', desc: '"Become a Host" link' },
  { target: 'user-menu',   label: '5', desc: 'User menu (globe + hamburger)' },
  { target: 'cat-strip',   label: '6', desc: 'Category filter strip' },
  { target: 'filter-btn',  label: '7', desc: 'Filters button → modal' },
  { target: 'first-card',  label: '8', desc: 'Listing card (click → detail)' },
  { target: 'view-toggle', label: '9', desc: 'Grid / Map view toggle' },
  { target: 'map-pill',    label: '10', desc: 'Floating map pill (mobile)' },
];

interface BadgePos { top: number; left: number; label: string; desc: string }

export default function AnnotationOverlay({ visible, onClose }: AnnotationOverlayProps) {
  useEffect(() => {
    if (!visible) return;
    const badges = document.querySelectorAll<HTMLElement>('[data-anno-id]');
    badges.forEach(badge => {
      const targetId = badge.dataset.annoId!;
      const el = document.getElementById(targetId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      badge.style.top  = `${Math.round(rect.top + rect.height / 2 - 14)}px`;
      badge.style.left = `${Math.round(rect.right - 14)}px`;
    });
  }, [visible]);

  if (!visible) return null;

  const positions: BadgePos[] = ANNOTATIONS.map(a => {
    const el = document.getElementById(a.target);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { top: Math.round(rect.top + rect.height / 2 - 14), left: Math.round(rect.right - 14), label: a.label, desc: a.desc };
  }).filter((p): p is BadgePos => p !== null);

  return (
    <div id="anno-overlay" className="fixed inset-0 z-[9000] pointer-events-none">
      <div className="absolute inset-0 bg-slate/20" onClick={onClose} style={{ pointerEvents: 'auto' }} />
      <button
        id="anno-close"
        onClick={onClose}
        className="absolute top-4 right-4 bg-white text-slate rounded-pill px-4 py-2 text-sm font-semibold shadow-md z-[9001]"
        style={{ pointerEvents: 'auto' }}
      >
        Close guide ✕
      </button>
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute w-7 h-7 rounded-full bg-lime text-slate text-xs font-bold flex items-center justify-center shadow-md z-[9001] group"
          style={{ top: pos.top, left: pos.left, pointerEvents: 'auto' }}
        >
          {pos.label}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate text-white text-xs rounded-md px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {pos.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
