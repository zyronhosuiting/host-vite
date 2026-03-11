import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import { useAvatar } from '../hooks/useAvatar';
import { useAuth } from '../hooks/useAuth';
import { getInitials } from '../utils/getInitials';

export default function UserNav() {
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);
  const { avatarUrl }     = useAvatar();
  const { user }          = useAuth();
  const navigate          = useNavigate();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  // Not logged in — show Sign in / Sign up
  if (!user) {
    return (
      <div className="flex items-center gap-2 justify-self-end">
        <Link
          to="/signin"
          className="text-sm font-semibold px-4 py-2 rounded-pill border border-border hover:bg-off-white transition-colors text-t1"
        >
          登入
        </Link>
        <Link
          to="/signup"
          className="text-sm font-semibold px-4 py-2 rounded-pill bg-slate text-lime hover:bg-slate-mid transition-colors"
        >
          註冊
        </Link>
      </div>
    );
  }

  // Logged in
  return (
    <div id="user-menu" className="flex items-center gap-1 justify-self-end" ref={ref}>
      <Link to="/cms" className="text-sm font-semibold px-3 py-2 rounded-pill hover:bg-off-white transition-colors whitespace-nowrap flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        CMS
      </Link>
      <button className="w-[38px] h-[38px] rounded-pill flex items-center justify-center text-t2 hover:bg-off-white transition-colors">
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="1.8"/>
        </svg>
      </button>
      <div className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 pl-3 pr-[6px] py-[6px] border border-border rounded-pill text-t2 hover:shadow-md transition-shadow"
        >
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-[30px] h-[30px] rounded-full object-cover" />
          ) : (
            <div className="w-[30px] h-[30px] rounded-pill bg-slate text-lime text-xs font-bold flex items-center justify-center">
              {getInitials(user.name)}
            </div>
          )}
        </button>
        {open && <UserDropdown onClose={() => { setOpen(false); }} onSignOut={() => { setOpen(false); navigate('/signin'); }} />}
      </div>
    </div>
  );
}
