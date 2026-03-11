import { useState } from 'react';

interface PhotoCarouselProps {
  photos?: string[];
  imgClass: string;
  alt: string;
  coverIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function PhotoCarousel({
  photos,
  imgClass,
  alt,
  coverIndex = 0,
  className = '',
  style,
  children,
}: PhotoCarouselProps) {
  const [idx, setIdx] = useState(coverIndex);
  const [hovered, setHovered] = useState(false);

  const hasPhotos = photos && photos.length > 0;
  const multi = hasPhotos && photos.length > 1;
  const src = hasPhotos ? photos[idx] : null;

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setIdx(i => (i - 1 + photos!.length) % photos!.length);
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setIdx(i => (i + 1) % photos!.length);
  }

  return (
    <div
      className={`relative overflow-hidden ${src ? '' : imgClass} ${className}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {src && (
        <img
          key={idx}
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: 'carousel-fade 0.2s ease' }}
        />
      )}

      {/* Overlay content (HeartButton, badge, etc.) */}
      {children}

      {/* Prev / Next arrows */}
      {multi && hovered && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full shadow-md flex items-center justify-center z-20 hover:bg-white hover:scale-105 transition-all"
            aria-label="Previous photo"
          >
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
              <path d="M15 18l-6-6 6-6" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 rounded-full shadow-md flex items-center justify-center z-20 hover:bg-white hover:scale-105 transition-all"
            aria-label="Next photo"
          >
            <svg viewBox="0 0 24 24" fill="none" width="12" height="12">
              <path d="M9 6l6 6-6 6" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {multi && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10 pointer-events-none">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-200 ${
                i === idx ? 'w-[6px] h-[6px] bg-white' : 'w-[5px] h-[5px] bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
