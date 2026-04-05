import { useState, type FormEvent } from 'react';
import { useFeedback } from '../../hooks/useFeedback';
import { useAuth } from '../../hooks/useAuth';

interface FeedbackSheetProps {
  onClose: () => void;
  onSuccess: () => void;
}

const TYPES = [
  { value: 'bug' as const, label: 'Bug', emoji: '🐛' },
  { value: 'idea' as const, label: 'Idea', emoji: '💡' },
  { value: 'mejora' as const, label: 'Mejora', emoji: '🔧' },
  { value: 'queja' as const, label: 'Queja', emoji: '😤' },
];

export function FeedbackSheet({ onClose, onSuccess }: FeedbackSheetProps) {
  const { sendFeedback } = useFeedback();
  const { profile } = useAuth();
  const [type, setType] = useState<'bug' | 'idea' | 'mejora' | 'queja' | null>(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!type || !text.trim()) return;
    setSending(true);
    setError('');
    try {
      await sendFeedback({
        type,
        text: text.trim(),
        screen: window.location.pathname,
        device_info: navigator.userAgent,
        created_by: profile?.display_name ?? 'anónimo',
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
      <div
        className="relative w-full max-w-md rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto"
        style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl m-0 mb-1" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}>
          📝 Enviar feedback
        </h2>
        <p className="text-xs mb-4" style={{ color: 'var(--earth-400)' }}>
          Tu nota llega directamente al equipo
        </p>

        <form onSubmit={handleSubmit}>
          {/* Type pills */}
          <div className="flex gap-2 mb-4">
            {TYPES.map((t) => {
              const selected = type === t.value;
              return (
                <button key={t.value} type="button" onClick={() => setType(t.value)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: selected ? 'var(--earth-900)' : 'transparent',
                    border: selected ? '2px solid var(--green-400)' : '1px solid var(--earth-600)',
                  }}>
                  <span className="text-lg">{t.emoji}</span>
                  <span className="text-[11px] font-medium" style={{ color: selected ? 'var(--earth-50)' : 'var(--earth-400)' }}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Text */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Cuéntanos qué pasa..."
            className="w-full rounded-lg px-3 py-2.5 outline-none resize-none mb-3 text-base"
            style={{
              background: 'var(--earth-900)',
              border: '1px solid var(--earth-600)',
              color: 'var(--earth-50)',
              fontSize: '16px',
            }}
          />

          {error && <p className="text-xs mb-2 m-0" style={{ color: 'var(--alert)' }}>{error}</p>}

          <button
            type="submit"
            disabled={sending || !type || !text.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-medium border-none cursor-pointer"
            style={{
              background: sending || !type || !text.trim() ? 'var(--earth-600)' : 'var(--green-600)',
              color: 'white',
              opacity: sending || !type || !text.trim() ? 0.6 : 1,
            }}
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}
