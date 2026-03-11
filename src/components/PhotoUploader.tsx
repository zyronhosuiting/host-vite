import { useRef } from 'react';

interface PhotoUploaderProps {
  photos: string[];
  coverIndex: number;
  onPhotosChange: (photos: string[], coverIndex: number) => void;
}

async function compressImage(file: File): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxDim = 1200;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.src = url;
  });
}

export default function PhotoUploader({ photos, coverIndex, onPhotosChange }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    const slots = 8 - photos.length;
    const compressed = await Promise.all(Array.from(files).slice(0, slots).map(compressImage));
    onPhotosChange([...photos, ...compressed], coverIndex);
  }

  function removePhoto(idx: number) {
    const next = photos.filter((_, i) => i !== idx);
    const nextCover = next.length === 0 ? 0 : idx === coverIndex ? 0 : coverIndex > idx ? coverIndex - 1 : coverIndex;
    onPhotosChange(next, nextCover);
  }

  function setCover(idx: number) {
    onPhotosChange(photos, idx);
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {photos.map((src, i) => (
          <div
            key={i}
            onClick={() => setCover(i)}
            className={`relative group rounded-xl overflow-hidden border-2 cursor-pointer transition-colors ${i === coverIndex ? 'border-lime' : 'border-border hover:border-t2'}`}
          >
            <img src={src} alt={`photo ${i + 1}`} className="w-full h-24 object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
            {i === coverIndex && (
              <span className="absolute bottom-1.5 left-1.5 bg-lime text-slate text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                封面
              </span>
            )}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); removePhoto(i); }}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity leading-none"
            >
              ×
            </button>
          </div>
        ))}

        {photos.length < 8 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-t3 hover:border-slate hover:text-t2 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span className="text-xs">上傳相片</span>
          </button>
        )}
      </div>

      <p className="text-xs text-t3">
        {photos.length}/8 張相片 · 點擊縮圖設為封面
        {photos.length === 0 && <span className="text-red-400 ml-1">（至少需要 1 張）</span>}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
}
