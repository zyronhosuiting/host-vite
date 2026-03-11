import type { ReactNode } from 'react';

interface FilterSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function FilterSection({ title, subtitle, children }: FilterSectionProps) {
  return (
    <section className="py-6">
      <h3 className="text-md font-semibold text-t1 mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-t3 mb-4">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
