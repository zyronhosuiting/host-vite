import type { Listing, ListingExtra } from '../types';
import PhotoUploader from './PhotoUploader';
import SearchBar from './SearchBar';
import AmenityGrid from './AmenityGrid';
import { cleanLoc } from '../utils/cleanLoc';

interface CmsFormProps {
  listing: Listing;
  extra: ListingExtra;
  onListingChange: (l: Listing) => void;
  onExtraChange: (e: ListingExtra) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CAT_KEYS: { key: string; label: string }[] = [
  { key: 'estate',     label: '私人屋苑' },
  { key: 'village',    label: '村屋' },
  { key: 'tong',       label: '唐樓' },
  { key: 'commercial', label: '工商廈' },
  { key: 'luxury',     label: '豪宅' },
  { key: 'house',      label: '獨立屋' },
  { key: 'parking',    label: '車位' },
  { key: 'shop',       label: '工商舖' },
];

const inputCls = 'w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-slate transition-colors bg-white';
const labelCls = 'block text-xs text-t3 mb-1';

export default function CmsForm({ listing, extra, onListingChange, onExtraChange, onSave, onCancel }: CmsFormProps) {
  const cats = listing.cats.split(' ').filter(Boolean);

  function setL<K extends keyof Listing>(key: K, value: Listing[K]) {
    onListingChange({ ...listing, [key]: value });
  }

  function setE<K extends keyof ListingExtra>(key: K, value: ListingExtra[K]) {
    onExtraChange({ ...extra, [key]: value });
  }

  function toggleCat(key: string) {
    const next = cats.includes(key) ? cats.filter(c => c !== key) : [...cats, key];
    if (!next.includes('all')) next.unshift('all');
    setL('cats', next.join(' '));
  }


  function handleLocationSelect(lat: number, lng: number, label: string) {
    const mapLoc = label.split(',')[0].trim();
    onListingChange({ ...listing, loc: cleanLoc(label), mapLoc, lat, lng });
  }

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-bold text-t1 mb-4">基本資料</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelCls}>房源名稱</label>
            <input className={inputCls} value={listing.name} onChange={e => setL('name', e.target.value)} placeholder="e.g. 新蒲崗現代一房單位" />
          </div>
          <div>
            <label className={labelCls}>副標題</label>
            <input className={inputCls} value={listing.sub} onChange={e => setL('sub', e.target.value)} placeholder="e.g. 整個單位 · 2人 · 1睡房" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-bold text-t1 mb-1">地理位置</h2>
        <p className="text-xs text-t3 mb-4">輸入地址後從建議清單中選擇，座標及地圖標記將自動更新</p>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelCls}>搜尋地址</label>
            <SearchBar onLocationSelect={handleLocationSelect} showLabel={false} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>顯示地址（可修改）</label>
              <input className={inputCls} value={listing.loc} onChange={e => setL('loc', e.target.value)} placeholder="完整地址" />
            </div>
            <div>
              <label className={labelCls}>地圖標籤（可修改）</label>
              <input className={inputCls} value={listing.mapLoc} onChange={e => setL('mapLoc', e.target.value)} placeholder="地區簡稱" />
            </div>
          </div>
          {/* Lat/Lng shown as read-only reference, not editable */}
          {(listing.lat !== 0 || listing.lng !== 0) && (
            <p className="text-xs text-t3">
              座標已自動設定：{listing.lat.toFixed(5)}, {listing.lng.toFixed(5)}
            </p>
          )}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-bold text-t1 mb-4">價格 & 評分</h2>
        <div className="grid gap-4">
          <div>
            <label className={labelCls}>每月租金 ($)</label>
            <input className={inputCls} type="number" min="1" value={listing.price} onChange={e => setL('price', Number(e.target.value))} />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-bold text-t1 mb-4">租屋分類</h2>
        <div>
          <div className="flex flex-wrap gap-2 mt-1">
            {CAT_KEYS.map(({ key, label }) => (
              <button key={key} type="button" onClick={() => toggleCat(key)}
                className={`px-3 py-2 text-xs rounded-xl border font-medium transition-all ${cats.includes(key) ? 'bg-slate text-lime border-slate shadow-sm' : 'bg-[#f3f4f6] border-[#d1d5db] text-t2 hover:bg-lime-soft hover:border-lime/50 hover:text-slate'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-bold text-t1 mb-4">房源詳情</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelCls}>面積 (呎)</label>
            <input className={inputCls} type="number" min="1" value={extra.area} onChange={e => setE('area', Number(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>房間數</label>
            <input className={inputCls} type="number" min="0" value={extra.beds} onChange={e => setE('beds', Number(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>浴室數</label>
            <input className={inputCls} type="number" min="0" value={extra.baths} onChange={e => setE('baths', Number(e.target.value))} />
          </div>
        </div>
        <div className="mb-4">
          <label className={labelCls}>房源介紹</label>
          <textarea className={`${inputCls} h-28 resize-y`} value={extra.desc} onChange={e => setE('desc', e.target.value)} placeholder="描述此房源..." />
        </div>
        <div className="mt-4">
          <label className={labelCls}>設施配套</label>
          <div className="mt-1">
            <AmenityGrid
              selected={new Set(extra.amenities ?? [])}
              onChange={s => setE('amenities', Array.from(s))}
            />
          </div>
        </div>
        <div className="grid  gap-4 pt-2">
          <div>
            <label className={labelCls}>租約期</label>
            <select className={inputCls} value={extra.leaseTerm ?? ''} onChange={e => setE('leaseTerm', e.target.value)}>
              <option value="">請選擇</option>
              <option value="12 個月">12 個月</option>
              <option value="彈性租約">彈性租約</option>
              <option value="短租">短租</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>房東電話（用於 WhatsApp 按鈕）</label>
          <input className={inputCls} value={extra.ownerPhone ?? ''} onChange={e => setE('ownerPhone', e.target.value)} placeholder="e.g. 85298765432" />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-border p-6">
        <h2 className="text-sm font-bold text-t1 mb-4">相片</h2>
        <PhotoUploader
          photos={listing.photos ?? []}
          coverIndex={listing.coverIndex ?? 0}
          onPhotosChange={(photos, coverIndex) => onListingChange({ ...listing, photos, coverIndex })}
        />
      </section>

      <div className="flex gap-3 pb-10">
        <button type="button" onClick={onCancel} className="flex-1 py-3 border border-border rounded-pill text-sm text-t2 hover:bg-off-white transition-colors">取消</button>
        <button type="button" onClick={onSave} className="flex-1 py-3 bg-slate text-lime rounded-pill text-sm font-bold hover:opacity-90 transition-opacity">儲存房源</button>
      </div>
    </div>
  );
}
