import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning';
  duration?: number;
  onDone: () => void;
}

const COLORS = {
  success: { bg: 'var(--green-900)', color: 'var(--green-200)', border: 'var(--green-600)' },
  info:    { bg: 'var(--earth-800)',  color: 'var(--water)',      border: 'var(--earth-600)' },
  warning: { bg: 'var(--orange-900)', color: 'var(--orange-200)', border: 'var(--orange-600)' },
};

export function Toast({ message, type = 'success', duration = 2500, onDone }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const c = COLORS[type];

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300); }, duration);
    return () => clearTimeout(t);
  }, [duration, onDone]);

  return (
    <div
      className="fixed top-4 left-4 right-4 z-[100] rounded-lg px-4 py-3 text-sm font-medium transition-all"
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-20px)',
      }}
    >
      {message}
    </div>
  );
}

// Simple hook for managing toasts
import { useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const show = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
  }, []);

  const element = toast ? (
    <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
  ) : null;

  return { show, element };
}
