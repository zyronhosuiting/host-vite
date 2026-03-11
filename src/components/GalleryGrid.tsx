import { useState } from 'react';
import type { Listing } from '../types';
import PhotoGalleryModal from './PhotoGalleryModal';

interface GalleryGridProps {
  listing: Listing;
}

export default function GalleryGrid({ listing: l }: GalleryGridProps) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  // Build ordered preview list: cover first, then others, max 5
  const allPhotos = l.photos && l.photos.length > 0 ? l.photos : null;
  const coverIdx  = l.coverIndex ?? 0;
  const preview: { src: string; originalIndex: number }[] = [];

  if (allPhotos) {
    preview.push({ src: allPhotos[coverIdx], originalIndex: coverIdx });
    allPhotos.forEach((src, i) => {
      if (i !== coverIdx && preview.length < 5) preview.push({ src, originalIndex: i });
    });
  }

  const count = preview.length; // 0–5
  const clickCls = 'cursor-pointer hover:brightness-90 transition-[filter]';

  function Skeleton() {
    return (
      <div className="w-full h-full bg-[#efefef] flex items-center justify-center animate-pulse">
        <svg viewBox="0 0 24 24" fill="none" width="32" height="32" className="text-[#d0d0d0]">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }

  function slot(i: number) {
    const p = preview[i];
    return (
      <div
        key={i}
        className={`relative overflow-hidden h-full w-full ${p ? clickCls : ''}`}
        onClick={() => p && setGalleryIndex(p.originalIndex)}
      >
        {p
          ? <img src={p.src} alt={`photo ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
          : <Skeleton />
        }
        {i === 0 && l.badge && (
          <span className="absolute top-4 left-4 bg-white text-slate text-xs font-bold px-3 py-1 rounded-pill z-10">
            {l.badge}
          </span>
        )}
      </div>
    );
  }

  // Desktop layout varies by photo count
  function desktopGrid() {
    if (count === 0) {
      return (
        <div className="h-[420px] rounded-xl overflow-hidden">
          <Skeleton />
        </div>
      );
    }

    if (count === 1) {
      return (
        <div className="h-[420px] rounded-xl overflow-hidden">
          {slot(0)}
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 h-[420px] rounded-xl overflow-hidden">
          {slot(0)}
          {slot(1)}
        </div>
      );
    }

    // count 3, 4, 5 — all use large left + 2×2 grid right
    return (
      <div className="grid grid-cols-2 gap-2 h-[420px] rounded-xl overflow-hidden">
        {slot(0)}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
          {slot(1)}
          {slot(2)}
          {slot(3)}
          {slot(4)}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Desktop */}
        <div className="hidden md:block">
          {desktopGrid()}
        </div>

        {/* Mobile: cover only */}
        <div
          className={`md:hidden h-[260px] rounded-xl overflow-hidden ${count > 0 ? clickCls : ''}`}
          onClick={() => count > 0 && setGalleryIndex(preview[0].originalIndex)}
        >
          {count > 0
            ? <img src={preview[0].src} alt={l.name} className="w-full h-full object-cover" />
            : <Skeleton />
          }
        </div>

        {/* Show all button */}
        {count > 0 && (
          <button
            onClick={() => setGalleryIndex(preview[0].originalIndex)}
            className="absolute bottom-4 right-4 bg-white text-t1 text-xs font-semibold px-3 py-2 rounded-lg shadow-sm border border-border flex items-center gap-1.5 hover:shadow-md transition-shadow"
          >
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
              <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
              <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
              <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
            </svg>
            顯示全部相片
          </button>
        )}
      </div>

      {galleryIndex !== null && allPhotos && (
        <PhotoGalleryModal
          photos={allPhotos}
          activeIndex={galleryIndex}
          title={l.name}
          onClose={() => setGalleryIndex(null)}
          onSelect={setGalleryIndex}
        />
      )}
    </>
  );
}
