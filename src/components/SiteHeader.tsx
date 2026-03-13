import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserNav from './UserNav';
import UserDropdown from './UserDropdown';
import CategoryBar from './CategoryBar';
import { useScrollShadow } from '../hooks/useScrollShadow';
import { useAvatar } from '../hooks/useAvatar';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { getInitials } from '../utils/getInitials';

interface SiteHeaderProps {
  activeCategory?: string;
  onCategoryChange?: (key: string) => void;
  mapVisible?: boolean;
  onToggleMap?: () => void;
  onFilterOpen?: () => void;
  filterCount?: number;
  onGuideOpen?: () => void;
  onLocationSelect?: (lat: number, lng: number, label: string) => void;
  showCategoryBar?: boolean;
  fullWidth?: boolean;
}

const noop = () => {};

export default function SiteHeader({
  onLocationSelect,
  onFilterOpen = noop,
  filterCount = 0,
  onToggleMap = noop,
  onGuideOpen = noop,
  mapVisible = false,
  showCategoryBar = true,
  fullWidth = false,
  ...props
}: SiteHeaderProps) {
  const { scrolled } = useScrollShadow();
  const navigate = useNavigate();
  const { avatarUrl } = useAvatar();
  const { user } = useAuth();
  const categories = useCategories();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [mobileMenuOpen]);

  const handleLocationSelect = onLocationSelect
    ?? ((lat: number, lng: number, label: string) => {
        navigate(`/search?lat=${lat}&lng=${lng}&label=${encodeURIComponent(label)}`);
      });

  return (
    <header
      id="site-header"
      className={`sticky top-0 z-[300] border-b border-border transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-[0_4px_20px_rgba(15,23,42,0.08)]'
          : 'bg-white'
      }`}
    >
      {/* ── Desktop top bar ── */}
      <div className={`${fullWidth ? 'w-full' : 'max-w-layout mx-auto'} h-[82px] hidden md:grid grid-cols-[160px_1fr_auto] items-center px-6 gap-4`}>
        <Logo />
        <SearchBar onLocationSelect={handleLocationSelect} />
        <UserNav />
      </div>

      {/* ── Mobile top bar ── */}
      <div className="flex md:hidden items-center gap-2 px-4 h-14">
        <Logo />
        <div className="flex-1" />
        {showCategoryBar && (
          <button
            onClick={onToggleMap}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              mapVisible ? 'bg-slate text-lime' : 'bg-off-white text-t2'
            }`}
            aria-label="Toggle map"
          >
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
              <path d="M9 20L3 17V4l6 3m0 13l6-3m-6 3V7m6 10l6 3V7l-6-3m0 13V4"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {showCategoryBar && <button
          onClick={onFilterOpen}
          className={`relative flex items-center gap-1.5 px-3 h-9 rounded-xl border transition-colors text-sm font-medium ${
            filterCount > 0
              ? 'bg-slate text-lime border-slate'
              : 'bg-white text-t2 border-border hover:border-border-dark'
          }`}
          aria-label="Filters"
        >
          <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
            <path d="M3 7h18M6 12h12M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>篩選</span>
          {filterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-lime text-slate text-[10px] font-bold flex items-center justify-center leading-none flex-shrink-0">
              {filterCount}
            </span>
          )}
        </button>}
        <div className="relative flex-shrink-0" ref={mobileMenuRef}>
          <button onClick={() => setMobileMenuOpen(v => !v)} className="flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate text-lime text-xs font-bold flex items-center justify-center">
                {user ? getInitials(user.name) : 'HL'}
              </div>
            )}
          </button>
          {mobileMenuOpen && (
            <UserDropdown
              onClose={() => setMobileMenuOpen(false)}
              onSignOut={() => { setMobileMenuOpen(false); navigate('/signin'); }}
            />
          )}
        </div>
      </div>

      {/* ── Mobile search row ── */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar onLocationSelect={handleLocationSelect} />
      </div>

      {showCategoryBar && (
        <CategoryBar
          categories={categories}
          activeCategory={props.activeCategory ?? ''}
          onCategoryChange={props.onCategoryChange ?? noop}
          mapVisible={mapVisible}
          onToggleMap={onToggleMap}
          onFilterOpen={onFilterOpen}
          onGuideOpen={onGuideOpen}
        />
      )}
    </header>
  );
}
