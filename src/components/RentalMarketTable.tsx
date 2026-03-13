import { useState } from 'react';
import { RENTAL_TRANSACTIONS } from '../data/rentalTransactions';

interface RentalMarketTableProps {
  district: string;
  categories: string[];
}

const PAGE_SIZE = 5;

export default function RentalMarketTable({ district, categories: listingCats }: RentalMarketTableProps) {
  const [expanded, setExpanded] = useState(false);

  const districtKey = district.split(/[,，\s]/)[0];

  function score(t: (typeof RENTAL_TRANSACTIONS)[0]): number {
    const sameDistrict = t.district === districtKey ? 0 : 1;
    const sameType     = t.categories.some(c => listingCats.includes(c)) ? 0 : 1;
    return sameDistrict * 2 + sameType;
  }

  const sorted = [...RENTAL_TRANSACTIONS].sort((a, b) => {
    const scoreDiff = score(a) - score(b);
    if (scoreDiff !== 0) return scoreDiff;
    return b.date.localeCompare(a.date);
  });

  const sameDistrictRows = sorted.filter(t => t.district === districtKey);
  const fillRows = sameDistrictRows.length >= PAGE_SIZE
    ? []
    : sorted.filter(t => t.district.toLowerCase() !== districtKey)
             .slice(0, PAGE_SIZE - sameDistrictRows.length);
  const rows = [...sameDistrictRows, ...fillRows];

  const visible = expanded ? rows : rows.slice(0, PAGE_SIZE);
  const hasMore = rows.length > PAGE_SIZE;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-t1">租賃市場數據</h2>
          <p className="text-xs text-t3 mt-0.5">同區同類型單位近期成交紀錄</p>
        </div>
        <span className="text-xs text-t3 bg-off-white border border-border rounded-pill px-3 py-1">
          {rows.length} 筆成交
        </span>
      </div>

      <div className="rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full text-sm" style={{ minWidth: 560, borderCollapse: 'collapse' }}>
            <thead>
              <tr className="bg-slate text-lime/70 text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-4 py-3 whitespace-nowrap">日期</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">樓盤</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">單位類型</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">面積</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">月租</th>
                <th className="text-left px-4 py-3 whitespace-nowrap">呎租</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((t, i) => {
                const rentPerSqft = Math.round(t.monthlyRent / t.area);
                const isSameDistrict = t.district === districtKey;
                const isSameType = isSameDistrict && t.categories.some(c => listingCats.includes(c));
                return (
                  <tr
                    key={i}
                    className={`border-t border-border transition-colors ${
                      isSameType ? 'bg-lime-soft/30 hover:bg-lime-soft/50' : 'bg-white hover:bg-off-white'
                    }`}
                  >
                    <td className="px-4 py-3 text-t3 font-mono text-xs whitespace-nowrap">{t.date}</td>
                    <td className="px-4 py-3 font-medium text-t1 whitespace-nowrap">{t.building}</td>
                    <td className="px-4 py-3 text-t2 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        {t.unitType}
                        {isSameType && (
                          <span className="text-[10px] bg-lime text-slate font-bold px-1.5 py-0.5 rounded-full leading-none">同類</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-t2 whitespace-nowrap">{t.area.toLocaleString()} 呎</td>
                    <td className="px-4 py-3 font-semibold text-t1 whitespace-nowrap">HK${t.monthlyRent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-t2 whitespace-nowrap">${rentPerSqft}/呎</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-4 w-full py-3 border border-border rounded-xl text-sm font-semibold text-t2 hover:bg-off-white transition-colors flex items-center justify-center gap-2"
        >
          {expanded ? '收起' : `查看更多成交紀錄 (${rows.length - PAGE_SIZE} 筆)`}
          <svg viewBox="0 0 24 24" fill="none" width="14" height="14" className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <p className="text-xs text-t3 mt-3">資料僅供參考，實際租金視乎個別單位及市況而定。</p>
    </div>
  );
}
