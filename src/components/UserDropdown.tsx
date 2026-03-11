import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface UserDropdownProps {
  onClose: () => void;
  onSignOut: () => void;
}

export default function UserDropdown({ onClose, onSignOut }: UserDropdownProps) {
  const { user, signOut } = useAuth();

  function handleSignOut() {
    signOut();
    onSignOut();
  }

  return (
    <div className="absolute top-[calc(100%+8px)] right-0 min-w-[220px] bg-white border border-border rounded-xl shadow-lg z-[600] overflow-hidden">
      {/* User info */}
      {user && (
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold text-t1 truncate">{user.name}</p>
          <p className="text-xs text-t3 truncate">{user.email}</p>
          {user.provider === 'google' && (
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-t3 bg-off-white border border-border rounded px-1.5 py-0.5">
              <svg viewBox="0 0 24 24" width="10" height="10">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google 帳號
            </span>
          )}
        </div>
      )}

      <Link to="/search"    onClick={onClose} className="flex items-center gap-[10px] px-4 py-3 text-sm text-t1 hover:bg-off-white transition-colors">房源搜尋</Link>
      <Link to="/favorites" onClick={onClose} className="flex items-center gap-[10px] px-4 py-3 text-sm text-t1 hover:bg-off-white transition-colors">心儀單位</Link>
      <Link to="/messages"  onClick={onClose} className="flex items-center gap-[10px] px-4 py-3 text-sm text-t1 hover:bg-off-white transition-colors">訊息</Link>
      <div className="h-px bg-border my-1" />
      <Link to="/profile"   onClick={onClose} className="flex items-center gap-[10px] px-4 py-3 text-sm text-t1 hover:bg-off-white transition-colors">個人簡介</Link>
      <div className="h-px bg-border my-1" />
      <button
        onClick={handleSignOut}
        className="flex items-center gap-[10px] px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
      >
        登出
      </button>
    </div>
  );
}
