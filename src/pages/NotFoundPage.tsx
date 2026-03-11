import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-[80px] font-bold text-border leading-none">404</h1>
      <p className="text-lg font-semibold text-t1">頁面不存在</p>
      <p className="text-sm text-t3">找不到你所尋找的頁面</p>
      <Link
        to="/search"
        className="px-6 py-3 bg-slate text-lime rounded-pill text-sm font-bold hover:bg-slate-mid transition-colors"
      >
        返回搜尋
      </Link>
    </div>
  );
}
