import { useNavigate, Link } from 'react-router-dom';
import type { Listing } from '../types';
import { useAuth } from '../hooks/useAuth';

interface RentalCardProps {
  listing: Listing;
}

export default function RentalCard({ listing: l }: RentalCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const phone = l.ownerPhone ?? '';
  const whatsappUrl = phone ? `https://wa.me/${phone.replace(/\D/g, '')}` : null;
  const loggedIn = !!user;

  const infoRows = [
    { label: '物業類型', value: l.propertyType || '私人住宅' },
    { label: '實用面積', value: `${l.area} 呎` },
    { label: '房間',     value: l.bedrooms > 0 ? `${l.bedrooms} 房 ${l.bathrooms} 廁` : `開放式 · ${l.bathrooms} 廁` },
    { label: '地區',     value: l.location },
    { label: '租約',     value: l.leaseTerm || '12 個月' },
  ];

  return (
    <div className="sticky top-[80px] bg-white border border-border rounded-2xl p-6 shadow-md">
      {/* Price block */}
      <div className="bg-off-white border border-border rounded-2xl p-4 mb-5 hover:border-border-dark transition-colors">
        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-border">
          <div>
            <p className="text-xs text-t3 mb-1">實用面積</p>
            <p className="text-xl font-bold text-t1 leading-none">{l.area}<span className="text-sm font-normal text-t3 ml-0.5">呎</span></p>
          </div>
          <div>
            <p className="text-xs text-t3 mb-1">平均呎價</p>
            <p className="text-xl font-bold text-t1 leading-none">${Math.round(l.price / l.area)}<span className="text-sm font-normal text-t3 ml-0.5">/呎</span></p>
          </div>
        </div>
        <div className="text-2xl font-bold text-t1 leading-none">HK${l.price.toLocaleString()}</div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-t3">每月租金</span>
          <span className="text-[10px] font-bold text-lime bg-slate px-2 py-0.5 rounded-full">免佣金</span>
        </div>
      </div>

      {/* Info grid */}
      <div className="border border-border rounded-xl overflow-hidden mb-5">
        {infoRows.map(({ label, value }, i) => (
          <div key={label} className={`flex justify-between px-4 py-2.5 text-sm ${i < infoRows.length - 1 ? 'border-b border-border' : ''}`}>
            <span className="text-t3 flex-shrink-0 mr-3">{label}</span>
            <span className="text-t1 font-medium text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col gap-2.5">
        <button
          disabled={!loggedIn}
          onClick={() => loggedIn && navigate(`/messages?listingId=${l.id}&property=${encodeURIComponent(l.name)}&host=${encodeURIComponent('房東')}`)}
          className="btn-lift w-full py-3 bg-slate text-lime rounded-xl font-bold text-sm hover:bg-slate-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate"
        >
          聯絡房東
        </button>

        {loggedIn ? (
          whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lift w-full py-3 border border-[#25D366] text-[#25D366] rounded-xl font-semibold text-sm text-center hover:bg-[#f0fdf4] transition-colors"
            >
              WhatsApp 房東
            </a>
          ) : (
            <button className="btn-lift w-full py-3 border border-[#25D366] text-[#25D366] rounded-xl font-semibold text-sm hover:bg-[#f0fdf4] transition-colors">
              WhatsApp 房東
            </button>
          )
        ) : (
          <button
            disabled
            className="w-full py-3 border border-[#25D366]/30 text-[#25D366]/30 rounded-xl font-semibold text-sm cursor-not-allowed"
          >
            WhatsApp 房東
          </button>
        )}

        {/* Login prompt */}
        {!loggedIn && (
          <div className="flex items-start gap-2 bg-off-white border border-border rounded-xl px-4 py-3 mt-1">
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15" className="text-t3 flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="text-xs text-t2 leading-relaxed">
              請先{' '}
              <Link to="/signin" className="font-semibold text-slate underline hover:no-underline">登入</Link>
              {' '}或{' '}
              <Link to="/signup" className="font-semibold text-slate underline hover:no-underline">註冊</Link>
              {' '}才能聯絡房東
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
