import type { Listing } from '../types';
import PhotoCarousel from './PhotoCarousel';
import HeartButton from './HeartButton';
import { cleanLoc } from '../utils/cleanLoc';
import { isNewListing } from '../utils/isNewListing';

interface MapMarkerPopupProps {
  listing: Listing;
}

export default function MapMarkerPopup({ listing: l }: MapMarkerPopupProps) {
  return (
    <div style={{
      width: 260,
      background: '#FFFFFF',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Image — 54:35 aspect ratio */}
      <div style={{ position: 'relative', width: '100%', paddingTop: `${(35 / 54) * 100}%` }}>
        <PhotoCarousel
          photos={l.photos}
          alt={l.name}
          coverIndex={l.coverIndex}
          style={{ position: 'absolute', inset: 0, borderRadius: '16px 16px 0 0' }}
          className="w-full h-full"
        >
          <HeartButton listingId={l.id} />
          {l.badge === '新上架' && isNewListing(l.listedDate) && (
            <span style={{
              position: 'absolute', top: 10, left: 10,
              background: '#FFFFFF', color: '#222222',
              fontSize: 11, fontWeight: 600,
              padding: '3px 8px', borderRadius: 9999,
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
              zIndex: 1,
            }}>
              {l.badge}
            </span>
          )}
        </PhotoCarousel>

      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight:700, color: '#222222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {l.name}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 14, color: '#6A6A6A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {cleanLoc(l.location)}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#8C8C8C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {l.subtitle}
        </p>
        <p style={{ margin: '10px 0 0', paddingTop: 10, borderTop: '1px solid #DDDDDD', fontSize: 16, fontWeight: 800, color: '#222222' }}>
          HK${l.price.toLocaleString()}
          <span style={{ fontWeight: 400, color: '#6A6A6A', fontSize: 14 }}> / 月</span>
        </p>
      </div>
    </div>
  );
}
