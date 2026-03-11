import { useFavorites } from '../hooks/useFavorites';

interface HeartButtonProps {
  listingId: number;
  className?: string;
}

export default function HeartButton({ listingId, className = '' }: HeartButtonProps) {
  const { isSaved, toggle } = useFavorites();
  const saved = isSaved(listingId);

  return (
    <button
      className={`absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 ${className}`}
      aria-label={saved ? 'Unsave' : 'Save'}
      onClick={e => { e.stopPropagation(); toggle(listingId); }}
    >
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z"
          fill={saved ? '#c5ff3f' : 'none'}
          stroke={saved ? '#111827' : 'white'}
          strokeWidth={saved ? '1.5' : '1.8'}
        />
      </svg>
    </button>
  );
}
