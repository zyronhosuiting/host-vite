import { useNavigate } from 'react-router-dom';
import type { Listing } from '../types';
import HeartButton from './HeartButton';
import PhotoCarousel from './PhotoCarousel';
import { cleanLoc } from '../utils/cleanLoc';
import { isNewListing } from '../utils/isNewListing';

interface ListingCardProps {
  listing: Listing;
  highlighted?: boolean;
}

export default function ListingCard({ listing: l, highlighted }: ListingCardProps) {
  const navigate = useNavigate();

  return (
    <article
      className={`listing-card cursor-pointer bg-white rounded-2xl overflow-hidden border border-border flex flex-row sm:flex-col ${highlighted ? 'outline outline-[2.5px] outline-lime' : ''}`}
      data-id={l.id}
      onClick={() => navigate(`/property/${l.id}`)}
    >
      {/* Image */}
      <div className="relative card-img flex-shrink-0 w-[110px] sm:w-auto">
        <PhotoCarousel
          photos={l.photos}
          imgClass={l.imgClass}
          alt={l.name}
          coverIndex={l.coverIndex}
          className="h-full sm:h-[220px] card-bg"
        >
          <HeartButton listingId={l.id} />
          {l.badge === '新上架' && isNewListing(l.listedDate) && (
            <span className={`absolute top-2 left-2 sm:top-3 sm:left-3 bg-white text-slate text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-pill z-10 ${l.badgeMod}`}>
              {l.badge}
            </span>
          )}
        </PhotoCarousel>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 flex-1 min-w-0 p-3 sm:p-4">
        <span className="text-lg font-semibold text-t1 truncate">{l.name}</span>
        <p className="text-md text-t2 leading-snug line-clamp-2">{cleanLoc(l.loc)}</p>
        <p className="text-sm text-t3 hidden sm:block">{l.sub}</p>
        <p className="text-md font-semibold mt-auto pt-2 border-t border-border sm:border-0 sm:pt-0 sm:mt-1">
          <strong className="font-bold text-t1">HK${l.price.toLocaleString()}</strong>
          <span className="text-t3 font-normal"> / 月</span>
        </p>
      </div>
    </article>
  );
}
