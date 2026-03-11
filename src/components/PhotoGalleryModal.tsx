import { useEffect, useRef } from 'react';

interface PhotoGalleryModalProps {
  photos: string[];
  activeIndex: number;
  title: string;
  onClose: () => void;
  onSelect: (i: number) => void;
}

export default function PhotoGalleryModal({ photos, activeIndex, title, onClose, onSelect }: PhotoGalleryModalProps) {
  const thumbRef = useRef<HTMLDivElement>(null);

  // Scroll active thumbnail into view
  useEffect(() => {
    const el = thumbRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeIndex]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') onSelect(Math.min(activeIndex + 1, photos.length - 1));
      if (e.key === 'ArrowLeft')  onSelect(Math.max(activeIndex - 1, 0));
      if (e.key === 'Escape')     onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeIndex, photos.length, onSelect, onClose]);

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border flex-shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-semibold text-t1 px-3 py-1.5 border border-border rounded-lg hover:bg-off-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          關閉
        </button>
        <p className="text-sm font-semibold text-t1 truncate mx-4">{title}</p>
        <p className="text-xs text-t3 flex-shrink-0">{activeIndex + 1} / {photos.length}</p>
      </div>

      {/* Thumbnail strip */}
      <div ref={thumbRef} className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none flex-shrink-0 border-b border-border bg-off-white">
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`flex-shrink-0 w-[88px] h-[60px] rounded-lg overflow-hidden border-2 transition-all ${
              i === activeIndex ? 'border-slate' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={p} alt={`photo ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative flex items-center justify-center bg-[#f5f5f5] min-h-0">
        <img
          src={photos[activeIndex]}
          alt={`photo ${activeIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
        />

        {/* Prev */}
        {activeIndex > 0 && (
          <button
            onClick={() => onSelect(activeIndex - 1)}
            className="absolute left-4 w-10 h-10 rounded-full bg-white shadow-md border border-border flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Next */}
        {activeIndex < photos.length - 1 && (
          <button
            onClick={() => onSelect(activeIndex + 1)}
            className="absolute right-4 w-10 h-10 rounded-full bg-white shadow-md border border-border flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
