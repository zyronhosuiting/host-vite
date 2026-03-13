import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import { api, getToken } from '../api/client';
import SiteHeader from '../components/SiteHeader';
import CmsForm from '../components/CmsForm';
import type { Listing } from '../types';

/**
 * After creating a new listing, upload data-URL photos to R2.
 * The listing was created with photos:[] on the backend;
 * each addPhoto call appends the R2 URL to the DB photos array.
 */
async function uploadPendingPhotos(listingId: number, photos: string[]) {
  if (!getToken()) return;
  const dataUrlPhotos = photos.filter(p => p.startsWith('data:'));
  if (dataUrlPhotos.length === 0) return;

  try {
    for (const dataUrl of dataUrlPhotos) {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'photo.jpg', { type: blob.type || 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/listings/${listingId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
  } catch (err) {
    console.error('Failed to upload pending photos after create', err);
  }
}

const DEFAULT_LISTING: Omit<Listing, 'id'> = {
  categories: ['all'], location: '', mapLocation: '', latitude: 22.3193, longitude: 114.1694,
  badge: '', name: '', subtitle: '', availableDates: '',
  listedDate: new Date().toISOString().slice(0, 10),
  updatedDate: new Date().toISOString().slice(0, 10),
  price: 100, rating: 4.9, reviews: 0,
  photos: [], coverIndex: 0,
  area: 400, bedrooms: 1, bathrooms: 1, description: '', features: [],
  propertyType: '', leaseTerm: '12 個月', ownerPhone: '', amenities: [],
};

export default function CmsEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, updateListing, createListing } = useListings();
  const isNew = id === undefined;
  const numId = Number(id);

  const [listing, setListing] = useState<Listing>(() => {
    if (isNew) return { ...DEFAULT_LISTING, id: 0 };
    return { ...DEFAULT_LISTING, ...listings.find(l => l.id === numId), id: numId };
  });

  async function handleSave() {
    if (!listing.name.trim()) return alert('請輸入房源名稱');
    if (!listing.photos || listing.photos.length === 0) return alert('請至少上傳 1 張相片');
    if (isNew) {
      // Create listing first, then upload any data-URL photos to R2
      const created = await createListing(listing);
      if (created && created.id) {
        await uploadPendingPhotos(created.id, listing.photos);
      }
    } else {
      updateListing(listing);
    }
    navigate('/cms');
  }

  return (
    <div className="min-h-screen bg-off-white">
      <SiteHeader showCategoryBar={false} />
      <div className="max-w-[800px] mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/cms')} className="text-t3 hover:text-t1 transition-colors text-sm">
            ← 返回
          </button>
          <h1 className="text-xl font-bold text-t1">{isNew ? '新增房源' : '編輯房源'}</h1>
        </div>
        <CmsForm
          listing={listing}
          onListingChange={setListing}
          onSave={handleSave}
          onCancel={() => navigate('/cms')}
        />
      </div>
    </div>
  );
}
