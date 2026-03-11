import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import SiteHeader from '../components/SiteHeader';
import CmsForm from '../components/CmsForm';
import type { Listing, ListingExtra } from '../types';

const DEFAULT_LISTING: Omit<Listing, 'id'> = {
  imgClass: 'card-img--1', cats: 'all', loc: '', mapLoc: '', lat: 22.3193, lng: 114.1694,
  badge: '', badgeMod: '', name: '', sub: '', dates: '',
  listedDate: new Date().toISOString().slice(0, 10),
  updatedDate: new Date().toISOString().slice(0, 10),
  price: 100, rating: 4.9, reviews: 0, dots: 3, saved: false, color: '#5c6bc0',
};

const DEFAULT_EXTRA: ListingExtra = { area: 400, beds: 1, baths: 1, desc: '', features: [], propertyType: '', leaseTerm: '12 個月', ownerPhone: '', amenities: [] };

export default function CmsEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, extras, updateListing, createListing } = useListings();
  const isNew = id === undefined;
  const numId = Number(id);

  const [listing, setListing] = useState<Listing>(() => {
    if (isNew) return { ...DEFAULT_LISTING, id: Date.now() };
    return { ...DEFAULT_LISTING, ...listings.find(l => l.id === numId), id: numId };
  });

  const [extra, setExtra] = useState<ListingExtra>(() => {
    if (isNew) return { ...DEFAULT_EXTRA };
    const found = extras[numId];
    return found ? { ...found, features: [...(found.features ?? [])] } : { ...DEFAULT_EXTRA };
  });

  function handleSave() {
    if (!listing.name.trim()) return alert('請輸入房源名稱');
    if (!listing.photos || listing.photos.length === 0) return alert('請至少上傳 1 張相片');
    if (isNew) {
      createListing(listing, extra);
    } else {
      updateListing(listing, extra);
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
          extra={extra}
          onListingChange={setListing}
          onExtraChange={setExtra}
          onSave={handleSave}
          onCancel={() => navigate('/cms')}
        />
      </div>
    </div>
  );
}
