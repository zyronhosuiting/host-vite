interface CardDotsProps {
  count: number;
}

export default function CardDots({ count }: CardDotsProps) {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`block w-[5px] h-[5px] rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}
        />
      ))}
    </div>
  );
}
