import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

interface PageHeaderProps {
  variant: 'inner' | 'detail';
}

const NAV_LINKS = [
  { to: '/search',    label: '房源搜尋' },
  { to: '/favorites', label: '心儀單位' },
  { to: '/messages',  label: '訊息' },
  { to: '/cms',       label: 'CMS' },
];

export default function PageHeader({ variant }: PageHeaderProps) {
  const navigate = useNavigate();

  if (variant === 'detail') {
    return (
      <header className="sticky top-0 z-[100] bg-white border-b border-border">
        <div className="max-w-layout mx-auto px-6 h-[64px] flex items-center justify-between relative">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-t1 hover:underline"
          >
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            返回搜尋
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-off-white transition-colors" title="分享">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="16 6 12 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="2" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button id="detail-save-btn" className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-off-white transition-colors" title="儲存">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                      stroke="currentColor" strokeWidth="1.8" fill="none"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-border">
      <div className="max-w-layout mx-auto px-6 h-[64px] flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-pill text-sm font-medium transition-colors ${
                  isActive ? 'bg-slate text-lime' : 'text-t2 hover:bg-off-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-3 pr-[6px] py-[6px] border border-border rounded-pill text-t2 hover:shadow-md transition-shadow"
        >
          <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
            <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <div className="w-[30px] h-[30px] rounded-pill bg-slate text-lime text-xs font-bold flex items-center justify-center">
            GW
          </div>
        </Link>
      </div>
    </header>
  );
}
