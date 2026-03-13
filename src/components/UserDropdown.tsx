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
