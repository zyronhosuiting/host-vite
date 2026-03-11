import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import SiteHeader from '../components/SiteHeader';
import { cleanLoc } from '../utils/cleanLoc';
import { isNewListing } from '../utils/isNewListing';

export default function CmsPage() {
  const navigate = useNavigate();
  const { listings, deleteListing } = useListings();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function handleDelete() {
    if (deleteId !== null) {
      deleteListing(deleteId);
      setDeleteId(null);
    }
  }

  return (
    <div className="min-h-screen bg-off-white">
      <SiteHeader showCategoryBar={false} />
      <div className="max-w-layout mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-t1">房源管理 CMS</h1>
            <p className="text-sm text-t3">{listings.length} 個房源</p>
          </div>
          <button
            onClick={() => navigate('/cms/new')}
            className="px-4 py-2 bg-slate text-lime rounded-pill text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            + 新增房源
          </button>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-off-white">
                <th className="text-left px-4 py-3 text-t3 font-medium">房源名稱</th>
                <th className="text-left px-4 py-3 text-t3 font-medium hidden md:table-cell">位置</th>
                <th className="text-left px-4 py-3 text-t3 font-medium hidden sm:table-cell">價格/晚</th>
                <th className="text-left px-4 py-3 text-t3 font-medium hidden lg:table-cell">標籤</th>
                <th className="px-4 py-3 w-[120px]"></th>
              </tr>
            </thead>
            <tbody>
              {listings.map(l => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-off-white transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden ${l.photos?.length ? 'bg-off-white' : l.imgClass}`}>
                      {l.photos?.length ? (
                        <img src={l.photos[l.coverIndex ?? 0]} alt={l.name} className="w-full h-full object-cover" />
                      ) : null}
                    </div>
                      <Link to={`/property/${l.id}`} className="font-medium text-t1 hover:underline line-clamp-1 max-w-[200px]">
                        {l.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-t2 hidden md:table-cell">{cleanLoc(l.loc)}</td>
                  <td className="px-4 py-3 font-semibold text-t1 hidden sm:table-cell">${l.price}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {l.badge === '新上架' && isNewListing(l.listedDate) && (
                      <span className="text-xs px-3 py-1 rounded-pill border font-bold whitespace-nowrap bg-slate text-lime border-slate">
                        {l.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/cms/edit/${l.id}`)}
                        className="px-3 py-1 text-xs border border-border rounded-pill hover:bg-off-white transition-colors"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => setDeleteId(l.id)}
                        className="px-3 py-1 text-xs border border-red-200 text-red-500 rounded-pill hover:bg-red-50 transition-colors"
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-base font-bold text-t1 mb-2">確認刪除</h2>
            <p className="text-sm text-t2 mb-6">
              刪除後無法復原，是否確認刪除「{listings.find(l => l.id === deleteId)?.name}」？
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-border rounded-pill text-sm text-t2 hover:bg-off-white transition-colors">取消</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 text-white rounded-pill text-sm font-semibold hover:bg-red-600 transition-colors">確認刪除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
