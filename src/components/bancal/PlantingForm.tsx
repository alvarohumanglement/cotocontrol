import { useState, type FormEvent } from 'react';
import { usePlantings } from '../../hooks/usePlantings';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import { useBancales } from '../../hooks/useBancales';

interface PlantingFormProps {
  bancalId: string;
  bancalName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function PlantingForm({ bancalId, bancalName, onClose, onSuccess }: PlantingFormProps) {
  const { addPlanting } = usePlantings(bancalId);
  const { addLog } = useActivityLogs(bancalId);
  const { updateBancalStatus } = useBancales();

  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [quantity, setQuantity] = useState('');
  const [plantedDate, setPlantedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const qty = parseInt(quantity, 10);
      await addPlanting({
        bancal_id: bancalId,
        crop_name: cropName,
        variety: variety || undefined,
        quantity: qty,
        planted_date: plantedDate,
        status: 'active',
        notes: notes || undefined,
      });
      await updateBancalStatus(bancalId, 'planted');
      await addLog({
        bancal_id: bancalId,
        action: 'planted',
        notes: `Plantado: ${cropName} × ${qty}`,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: 'var(--earth-900)',
    border: '1px solid var(--earth-600)',
    color: 'var(--earth-50)',
    fontSize: '16px',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl m-0 mb-1" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}>
          Nueva plantación
        </h2>
        <p className="text-xs mb-4" style={{ color: 'var(--earth-400)' }}>{bancalName}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: 'var(--earth-200)' }}>Cultivo *</label>
            <input type="text" required value={cropName} onChange={(e) => setCropName(e.target.value)}
              placeholder="Ej: Tomates cherry" className="w-full rounded-lg px-3 py-2.5 outline-none focus:border-[var(--green-400)]" style={inputStyle} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: 'var(--earth-200)' }}>Variedad</label>
            <input type="text" value={variety} onChange={(e) => setVariety(e.target.value)}
              placeholder="Ej: Rosa de Barbastro" className="w-full rounded-lg px-3 py-2.5 outline-none focus:border-[var(--green-400)]" style={inputStyle} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--earth-200)' }}>Cantidad *</label>
              <input type="number" required min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)}
                placeholder="Nº plantas" className="w-full rounded-lg px-3 py-2.5 outline-none focus:border-[var(--green-400)]" style={inputStyle} />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--earth-200)' }}>Fecha</label>
              <input type="date" value={plantedDate} onChange={(e) => setPlantedDate(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 outline-none focus:border-[var(--green-400)]" style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: 'var(--earth-200)' }}>Notas</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              placeholder="Observaciones..." className="w-full rounded-lg px-3 py-2.5 outline-none resize-none focus:border-[var(--green-400)]" style={inputStyle} />
          </div>

          {error && <p className="text-xs m-0" style={{ color: 'var(--alert)' }}>{error}</p>}

          <div className="flex gap-2 mt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
              style={{ background: 'transparent', border: '1px solid var(--earth-600)', color: 'var(--earth-200)' }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border-none cursor-pointer"
              style={{ background: saving ? 'var(--earth-600)' : 'var(--green-600)', color: 'var(--earth-50)', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Guardando...' : 'Plantar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
