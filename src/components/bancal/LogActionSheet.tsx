import { useState, type FormEvent } from 'react';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import { ACTION_TYPES } from '../../lib/constants';
import type { ActionType } from '../../lib/types';

interface LogActionSheetProps {
  bancalId: string;
  bancalName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const PLACEHOLDERS: Partial<Record<ActionType, string>> = {
  watered: 'Duración, cantidad...',
  fertilized: 'Tipo de abono, cantidad...',
  harvested: 'Cantidad cosechada...',
  treated: 'Producto usado, dosis...',
  observed: 'Qué has observado...',
  soil_work: 'Tipo de trabajo realizado...',
};

export function LogActionSheet({ bancalId, bancalName, onClose, onSuccess }: LogActionSheetProps) {
  const { addLog } = useActivityLogs(bancalId);
  const [selected, setSelected] = useState<ActionType | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      await addLog({
        bancal_id: bancalId,
        action: selected,
        notes: notes || undefined,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const actionEntries = Object.entries(ACTION_TYPES) as [ActionType, typeof ACTION_TYPES[ActionType]][];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />

      <div
        className="relative w-full max-w-md rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto"
        style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl m-0 mb-1" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}>
          Registrar acción
        </h2>
        <p className="text-xs mb-4" style={{ color: 'var(--earth-400)' }}>{bancalName}</p>

        <form onSubmit={handleSubmit}>
          {/* Action grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {actionEntries.map(([key, at]) => {
              const isSelected = selected === key;
              return (
                <button key={key} type="button"
                  onClick={() => setSelected(key)}
                  className="flex flex-col items-center gap-1 py-3 px-1 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: isSelected ? 'var(--earth-900)' : 'transparent',
                    border: isSelected ? `2px solid ${at.color}` : '1px solid var(--earth-600)',
                  }}
                >
                  <span className="text-xl">{at.emoji}</span>
                  <span className="text-[10px] font-medium" style={{ color: isSelected ? 'var(--earth-50)' : 'var(--earth-400)' }}>
                    {at.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Notes — visible when action selected */}
          {selected && (
            <>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={PLACEHOLDERS[selected] ?? 'Notas...'}
                className="w-full rounded-lg px-3 py-2.5 outline-none resize-none mb-3 text-base focus:border-[var(--green-400)]"
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
                disabled={saving}
                className="w-full py-2.5 rounded-lg text-sm font-medium border-none cursor-pointer"
                style={{
                  background: saving ? 'var(--earth-600)' : ACTION_TYPES[selected].color,
                  color: 'white',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Guardando...' : 'Registrar'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
