import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import { useListings } from '../hooks/useListings';
import { useAvatar } from '../hooks/useAvatar';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import SiteHeader from '../components/SiteHeader';
import GalleryGrid from '../components/GalleryGrid';
import RentalCard from '../components/RentalCard';
import RentalMarketTable from '../components/RentalMarketTable';
import AmenityGrid from '../components/AmenityGrid';
import ListingCard from '../components/ListingCard';
import { getInitials } from '../utils/getInitials';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings } = useListings();
  const { avatarUrl } = useAvatar();
  const { user } = useAuth();
  const guestId = useMemo(() => String(Math.floor(Math.random() * 900) + 100).padStart(3, '0'), []);
  const hostName = user ? (user.name || user.email) : `用戶 ${guestId}`;
  const listing = listings.find(l => l.id === Number(id));

  const [schoolNet, setSchoolNet] = useState<{ primarySchoolNet: string; secondarySchoolNet: string } | null>(null);

  useEffect(() => {
    if (!listing) return;
    let cancelled = false;

    api.get('/reference-data/school-nets', { params: { mapLocation: listing.mapLocation } })
      .then(({ data }) => {
        if (!cancelled && data) {
          setSchoolNet(data);
        }
      })
      .catch(() => { /* API unavailable */ });

    return () => { cancelled = true; };
  }, [listing]);

  const primaryNet = schoolNet?.primarySchoolNet ?? '—';
  const secondaryNet = schoolNet?.secondarySchoolNet ?? '—';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (listing) document.title = `${listing.name} — Host Living`;
    return () => { document.title = 'Host Living'; };
  }, [id, listing]);

  if (!listing) {
    return (
      <>
        <SiteHeader showCategoryBar={false} />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-lg text-t2">找不到此房源</p>
          <a href="/search" className="text-sm text-slate underline">返回搜尋</a>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <SiteHeader showCategoryBar={false} />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/search')}
          className="flex items-center gap-1.5 text-sm text-t2 hover:text-t1 mb-5 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          返回搜尋
        </button>
        <GalleryGrid listing={listing} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Main content */}
          <div className="flex flex-col divide-y divide-border">
            {/* Title */}
            <div className="pb-8">
              <h1 className="text-2xl font-bold text-t1 mb-2">{listing.name}</h1>
              <div className="flex items-center gap-2 text-sm text-t2">
                <span className="underline">{listing.location}</span>
              </div>
              <p className="text-xs text-t3 mt-1.5">{listing.subtitle}</p>
            </div>

            {/* Stats */}
            <div className="py-8">
              <div className="grid grid-cols-3 md:grid-cols-3 gap-3 mb-6">
                <div className="bg-off-white rounded-2xl p-4 border border-border hover:border-border-dark transition-colors">
                  <p className="text-xs text-t3 mb-1.5 uppercase tracking-wide">實用面積</p>
                  <p className="text-2xl font-bold text-t1 leading-none">{listing.area}<span className="text-sm font-normal text-t3 ml-0.5">呎</span></p>
                  <p className="text-sm font-semibold text-t2 mt-1.5">HK${Math.round(listing.price / listing.area)}<span className="font-normal text-t3">/呎・月</span></p>
                </div>
                <div className="bg-off-white rounded-2xl p-4 border border-border hover:border-border-dark transition-colors">
                  <p className="text-xs text-t3 mb-1.5 uppercase tracking-wide">房間</p>
                  <p className="text-2xl font-bold text-t1 leading-none">{listing.bedrooms > 0 ? `${listing.bedrooms}房` : '開放式'}</p>
                  <p className="text-xs text-t3 mt-1.5">{listing.bathrooms} 個浴室</p>
                </div>
                <div className="bg-off-white rounded-2xl p-4 border border-border hover:border-border-dark transition-colors">
                  <p className="text-xs text-t3 mb-1.5 uppercase tracking-wide">租約</p>
                  <p className="text-2xl font-bold text-t1 leading-none">{listing.leaseTerm ? listing.leaseTerm.replace('個月', '') : '12'}</p>
                  <p className="text-xs text-t3 mt-1.5">個月租約</p>
                </div>
              </div>

              {/* Host row */}
              <div className="flex items-center gap-4 py-4 border-t border-border">
                <div className="flex-shrink-0">
                  {user && avatarUrl ? (
                    <img src={avatarUrl} alt="房東" className="w-10 h-10 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate text-lime text-sm font-bold flex items-center justify-center">
                      {getInitials(user?.name)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-t1">{hostName}</p>
                  <p className="text-xs text-t3">{listing.subtitle}</p>
                </div>
              </div>

              {/* Features */}
              {listing.features.map((f, i) => {
                const [title, ...rest] = f.split(' — ');
                return (
                  <div key={i} className="flex items-start gap-4 py-3">
                    <div className="w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0 text-t1">
                      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-t1">{title}</p>
                      {rest.length > 0 && <p className="text-xs text-t3 mt-0.5">{rest.join(' — ')}</p>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <div className="py-8">
              <h2 className="text-lg font-bold text-t1 mb-4">房源介紹</h2>
              <p className="text-sm text-t2 leading-relaxed">{listing.description}</p>
            </div>

            {/* School nets + listing dates */}
            <div className="py-8">
              <h2 className="text-lg font-bold text-t1 mb-4">校網資訊</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-off-white rounded-2xl p-4 border border-border">
                  <p className="text-xs text-t3 mb-1.5 uppercase tracking-wide">小學校網</p>
                  <p className="text-xl font-bold text-t1 leading-none">
                    {primaryNet}
                  </p>
                  <p className="text-xs text-t3 mt-1.5">教育局小學學位分配</p>
                </div>
                <div className="bg-off-white rounded-2xl p-4 border border-border">
                  <p className="text-xs text-t3 mb-1.5 uppercase tracking-wide">中學校網</p>
                  <p className="text-xl font-bold text-t1 leading-none">
                    {secondaryNet}
                  </p>
                  <p className="text-xs text-t3 mt-1.5">教育局中學學位分配</p>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-border text-sm text-t3">
                <span>
                  刊登日期：<span className="text-t2 font-medium">{listing.listedDate}</span>
                </span>
                <span>
                  更新日期：<span className="text-t2 font-medium">{listing.updatedDate}</span>
                </span>
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="py-8">
                <h2 className="text-lg font-bold text-t1 mb-4">設施配套</h2>
                <AmenityGrid
                  selected={new Set(listing.amenities)}
                  onChange={() => {}}
                  readOnly
                />
              </div>
            )}

            {/* Map */}
            <div className="py-8">
              <h2 className="text-lg font-bold text-t1 mb-4">位置</h2>
              <div className="h-[280px] rounded-xl overflow-hidden border border-border mb-3" style={{ isolation: 'isolate' }}>
                <MapContainer
                  center={[listing.latitude, listing.longitude]}
                  zoom={14}
                  style={{ width: '100%', height: '100%' }}
                  zoomControl
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>'
                    subdomains="abcd"
                    maxZoom={19}
                  />
                  <Circle
                    center={[listing.latitude, listing.longitude]}
                    radius={300}
                    pathOptions={{ color: '#c5ff3f', fillColor: '#c5ff3f', fillOpacity: 0.15, weight: 2 }}
                  />
                </MapContainer>
              </div>
              <p className="text-sm font-semibold text-t1">{listing.location}</p>
            </div>

            {/* Rental market data */}
            <div className="divide-y divide-border">
              <RentalMarketTable district={listing.location} categories={listing.categories} />
            </div>

            {/* Similar listings */}
            {(() => {
              const listingCategories = listing.categories;
              const similar = listings
                .filter(l => l.id !== listing.id && l.categories.some(c => listingCategories.includes(c)))
                .slice(0, 3);
              if (similar.length === 0) return null;
              return (
                <div className="py-8">
                  <h2 className="text-lg font-bold text-t1 mb-4">相關推介</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {similar.map(l => <ListingCard key={l.id} listing={l} />)}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Rental sidebar */}
          <div className="hidden lg:block">
            <RentalCard listing={listing} />
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 flex items-center gap-3 z-50">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-t3 truncate font-medium">{listing.name}</p>
          <p className="text-sm font-bold text-t1">HK${listing.price.toLocaleString()} <span className="font-normal text-t3">/ 月</span></p>
        </div>
        {listing.ownerPhone && (
          <a
            href={`https://wa.me/${listing.ownerPhone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-[#25D366] text-[#25D366] rounded-pill text-sm font-semibold whitespace-nowrap hover:bg-[#f0fdf4] transition-colors"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        )}
        <button
          onClick={() => user
            ? navigate(`/messages?listingId=${listing.id}&property=${encodeURIComponent(listing.name)}&host=${encodeURIComponent('房東')}`)
            : navigate('/signin')
          }
          className="px-4 py-2.5 bg-slate text-lime rounded-pill text-sm font-bold whitespace-nowrap hover:bg-slate-mid transition-colors"
        >
          聯絡房東
        </button>
      </div>
    </div>
  );
}
