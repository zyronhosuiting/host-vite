interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-slate text-lime px-6 py-3 rounded-pill text-sm font-semibold shadow-lg">
      {message}
    </div>
  );
}
