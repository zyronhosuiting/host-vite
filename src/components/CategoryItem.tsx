import type { Category } from '../types';

interface CategoryItemProps {
  cat: Category;
  active: boolean;
  onClick: () => void;
}

export default function CategoryItem({ cat, active, onClick }: CategoryItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl whitespace-nowrap flex-shrink-0 transition-all duration-150 ${
        active
          ? 'bg-slate text-lime shadow-sm'
          : 'text-t3 hover:bg-off-white hover:text-t1'
      }`}
    >
      <svg
        className={`w-6 h-6 sm:w-5 sm:h-5 transition-transform duration-150 ${active ? 'scale-110' : ''}`}
        viewBox="0 0 32 32"
        dangerouslySetInnerHTML={{ __html: cat.icon }}
      />
      <span className="text-[11px] sm:text-xs font-semibold">{cat.label}</span>
    </button>
  );
}
