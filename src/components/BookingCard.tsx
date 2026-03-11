import type { Listing } from '../types';

interface BookingCardProps {
  listing: Listing;
}

const NIGHTS = 5;

export default function BookingCard({ listing: l }: BookingCardProps) {
  const subtotal   = l.price * NIGHTS;
  const cleanFee   = Math.round(l.price * 0.15);
  const serviceFee = Math.round(subtotal * 0.12);
  const total      = subtotal + cleanFee + serviceFee;
  const [checkIn, checkOut] = l.dates.split(' – ');

  return (
    <div className="sticky top-[80px] bg-white border border-border rounded-2xl p-6 shadow-md">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xl font-bold text-t1">${l.price}</span>
        <span className="text-sm text-t3">/ night</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-t3 mb-5">
        <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
        </svg>
        {l.rating} · {l.reviews} 則評價
      </div>

      <div className="border border-border rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-t1 mb-0.5">入住</p>
            <p className="text-sm text-t2">{checkIn || '—'}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-t1 mb-0.5">退房</p>
            <p className="text-sm text-t2">{checkOut || '—'}</p>
          </div>
        </div>
      </div>

      <button className="w-full py-3 bg-slate text-lime rounded-xl font-bold text-sm mb-3 hover:bg-slate-mid transition-colors">
        立即預訂
      </button>
      <button className="w-full py-3 border border-slate text-slate rounded-xl font-semibold text-sm mb-4 hover:bg-off-white transition-colors">
        聯絡房東
      </button>
      <p className="text-xs text-center text-t3 mb-5">確認後才收費</p>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex justify-between text-sm text-t2">
          <span>${l.price} × {NIGHTS} 晚</span><span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-t2">
          <span>清潔費</span><span>${cleanFee}</span>
        </div>
        <div className="flex justify-between text-sm text-t2">
          <span>服務費</span><span>${serviceFee}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-t1 border-t border-border pt-3">
          <span>總計</span><span>${total}</span>
        </div>
      </div>
    </div>
  );
}
