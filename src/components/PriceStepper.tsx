interface PriceStepperProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export default function PriceStepper({ label, value, onChange }: PriceStepperProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm text-t1">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-full border border-border-dark flex items-center justify-center text-t2 hover:border-t1 transition-colors text-lg leading-none"
        >
          −
        </button>
        <span className="text-sm font-medium text-t1 w-8 text-center">{value === 0 ? 'Any' : `${value}+`}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-border-dark flex items-center justify-center text-t2 hover:border-t1 transition-colors text-lg leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
