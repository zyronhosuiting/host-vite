import { useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import { useFavorites } from '../hooks/useFavorites';
import { useListings } from '../hooks/useListings';
import HeartButton from '../components/HeartButton';

export default function FavoritesPage() {
  const { savedIds } = useFavorites();
  const { listings } = useListings();
  const navigate = useNavigate();
  const saved = listings.filter(l => savedIds.includes(l.id));

  return (
    <div className="min-h-screen bg-off-white">
      <SiteHeader showCategoryBar={false} />
      <div className="max-w-layout mx-auto px-6 py-10">
        <h1 className="text-xl font-bold text-t1 mb-1">心儀單位</h1>
        <p className="text-sm text-t3 mb-8">你儲存的所有房源</p>

        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-t3">
            <svg viewBox="0 0 24 24" fill="none" width="48" height="48">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                    stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <p className="text-sm">尚未儲存任何房源</p>
            <button onClick={() => navigate('/search')} className="text-sm text-slate underline">立即搜尋</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {saved.map(l => (
              <div
                key={l.id}
                className="cursor-pointer"
                onClick={() => navigate(`/property/${l.id}`)}
              >
                <div className="relative mb-3">
                  <div className="h-[220px] rounded-lg relative overflow-hidden bg-off-white">
                    {l.photos?.length ? (
                      <img src={l.photos[l.coverIndex ?? 0]} alt={l.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : null}
                    <HeartButton listingId={l.id} />
                  </div>
                </div>
                <p className="text-xs text-t3">{l.location}</p>
                <p className="text-sm font-semibold text-t1">{l.name}</p>
                <p className="text-xs text-t3">{l.subtitle}</p>
                <p className="text-sm mt-1">
                  <strong className="font-semibold">${l.price}</strong>
                  <span className="text-t3"> / night</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
