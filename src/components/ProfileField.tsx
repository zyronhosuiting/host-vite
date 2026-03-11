import type { ChangeEvent } from 'react';

interface ProfileFieldProps {
  label: string;
  value: string;
  type?: string;
  readOnly: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileField({ label, value, type = 'text', readOnly, onChange }: ProfileFieldProps) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-border last:border-0">
      <label className="text-xs font-semibold text-t3 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        className={`text-sm text-t1 w-full rounded-md px-3 py-2 transition-colors outline-none ${
          readOnly
            ? 'bg-transparent cursor-default'
            : 'bg-off-white border border-border focus:border-slate'
        }`}
      />
    </div>
  );
}
