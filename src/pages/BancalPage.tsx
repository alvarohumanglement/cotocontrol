import { useState, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBancales } from '../hooks/useBancales';
import { usePlantings } from '../hooks/usePlantings';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { ACTION_TYPES, CROP_STAGES, BANCAL_STATES } from '../lib/constants';
import { PlantingForm } from '../components/bancal/PlantingForm';
import { LogActionSheet } from '../components/bancal/LogActionSheet';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import { useLastWatered } from '../hooks/useLastWatered';
import type { Bancal, Planting } from '../lib/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  planted:          { bg: 'var(--green-50)',   text: 'var(--green-800)',  label: 'Plantado' },
  empty:            { bg: 'var(--earth-200)',  text: 'var(--earth-800)',  label: 'Libre' },
  available:        { bg: 'var(--earth-200)',  text: 'var(--earth-800)',  label: 'Disponible' },
  fallow:           { bg: 'var(--orange-50)',  text: 'var(--orange-800)', label: 'Barbecho' },
  chickens:         { bg: 'var(--orange-50)',  text: 'var(--orange-800)', label: '🐔 Gallinas' },
  waiting_chickens: { bg: 'var(--orange-50)',  text: 'var(--orange-800)', label: '🐔 Esperando gallinas' },
  post_chickens:    { bg: 'var(--green-50)',   text: 'var(--green-800)',  label: 'Post-gallinas' },
  resting:          { bg: 'var(--earth-200)',  text: 'var(--earth-800)',  label: 'Descanso' },
};

const FINALIZE_CONFIG = {
  harvested: { title: 'Cosechar', emoji: '🧺', placeholder: 'Cantidad cosechada, calidad, observaciones...', btnBg: 'var(--green-600)', action: 'harvested' as const },
  removed:   { title: 'Retirar',  emoji: '❌', placeholder: 'Motivo de retirada...', btnBg: 'var(--earth-600)', action: 'other' as const },
  failed:    { title: 'Registrar pérdida', emoji: '💀', placeholder: 'Qué pasó, causa probable...', btnBg: 'var(--alert)', action: 'observed' as const },
};

/* ── Stage Editor Row ── */
function StageEditor({ planting, onStageChange }: { planting: Planting; onStageChange: (stage: number) => void }) {
  const current = planting.stage ?? 0;
  return (
    <div className="flex gap-1 mt-2 overflow-x-auto">
      {[0, 1, 2, 3, 4].map((s) => {
        const st = CROP_STAGES[s];
        const isCurrent = s === current;
        const isPast = s < current;
        return (
          <button key={s} onClick={() => onStageChange(s)}
            className="flex items-center gap-0.5 shrink-0 cursor-pointer border-none transition-all"
            style={{
              background: isCurrent ? st.bg : 'transparent',
              color: isCurrent ? st.color : isPast ? st.color : 'var(--earth-600)',
              borderRadius: '999px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: isCurrent ? 600 : 400,
              opacity: isCurrent ? 1 : isPast ? 0.6 : 0.35,
              transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
            }}>
            <span>{st.emoji}</span>
            <span className="hidden sm:inline">{st.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Planting Card ── */
function PlantingCard({ planting, onFinalize, onStageChange }: {
  planting: Planting;
  onFinalize: (id: string, status: 'harvested' | 'failed' | 'removed') => void;
  onStageChange: (id: string, stage: number) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const stage = CROP_STAGES[planting.stage ?? 0];

  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}>
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm" style={{ color: 'var(--earth-50)' }}>
              {planting.crop_name}
            </span>
            {/* Stage badge */}
            <span style={{ background: stage.bg, color: stage.color, borderRadius: '999px', padding: '2px 10px', fontSize: '12px' }}>
              {stage.emoji} {stage.label}
            </span>
          </div>
          {planting.variety && (
            <p className="text-xs mt-0.5 mb-0" style={{ color: 'var(--earth-400)' }}>{planting.variety}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
            ×{planting.quantity}
          </span>
          <button onClick={() => setShowMenu(!showMenu)}
            className="text-sm leading-none bg-transparent border-none cursor-pointer px-1 py-0.5 rounded"
            style={{ color: 'var(--earth-400)' }}>
            ···
          </button>
        </div>
      </div>

      <p className="text-xs mt-1 mb-0" style={{ color: 'var(--earth-400)' }}>
        Plantado {formatDate(planting.planted_date)}
      </p>
      {planting.notes && (
        <p className="text-xs mt-1 mb-0 italic" style={{ color: 'var(--earth-400)' }}>{planting.notes}</p>
      )}

      {/* Stage editor */}
      <StageEditor planting={planting} onStageChange={(s) => onStageChange(planting.id, s)} />

      {/* Finalize menu */}
      {showMenu && (
        <div className="flex gap-2 mt-2 pt-2" style={{ borderTop: '1px solid var(--earth-600)' }}>
          <button onClick={() => { setShowMenu(false); onFinalize(planting.id, 'harvested'); }}
            className="flex-1 text-xs py-1.5 rounded cursor-pointer border-none"
            style={{ background: 'var(--green-900)', color: 'var(--green-200)' }}>
            🧺 Cosechar
          </button>
          <button onClick={() => { setShowMenu(false); onFinalize(planting.id, 'removed'); }}
            className="flex-1 text-xs py-1.5 rounded cursor-pointer border-none"
            style={{ background: 'var(--earth-900)', color: 'var(--earth-400)' }}>
            ❌ Retirar
          </button>
          <button onClick={() => { setShowMenu(false); onFinalize(planting.id, 'failed'); }}
            className="flex-1 text-xs py-1.5 rounded cursor-pointer border-none"
            style={{ background: 'var(--alert-light)', color: 'var(--alert)' }}>
            💀 Perdida
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Finalize Modal ── */
function FinalizeModal({ planting, status, onConfirm, onClose }: {
  planting: Planting;
  status: 'harvested' | 'failed' | 'removed';
  onConfirm: (notes: string) => void;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const config = FINALIZE_CONFIG[status];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onConfirm(notes);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
      <div className="relative rounded-xl p-5 max-w-sm w-full mx-4"
        style={{ background: 'var(--earth-800)' }}
        onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base m-0 mb-1" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}>
          {config.emoji} {config.title} {planting.crop_name}
        </h3>
        <p className="text-xs mb-3" style={{ color: 'var(--earth-400)' }}>
          Stage: {CROP_STAGES[planting.stage ?? 0].emoji} {CROP_STAGES[planting.stage ?? 0].label}
        </p>
        <form onSubmit={handleSubmit}>
          <textarea required value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            placeholder={config.placeholder}
            className="w-full rounded-lg px-3 py-2.5 outline-none resize-none mb-3 text-base"
            style={{ background: 'var(--earth-900)', border: '1px solid var(--earth-600)', color: 'var(--earth-50)', fontSize: '16px' }} />
          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm cursor-pointer"
              style={{ background: 'transparent', border: '1px solid var(--earth-600)', color: 'var(--earth-200)' }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving || !notes.trim()}
              className="flex-1 py-2 rounded-lg text-sm font-medium border-none cursor-pointer"
              style={{ background: saving ? 'var(--earth-600)' : config.btnBg, color: 'white', opacity: saving || !notes.trim() ? 0.6 : 1 }}>
              {saving ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── History Card ── */
function HistoryCard({ planting }: { planting: Planting }) {
  const statusLabel: Record<string, { emoji: string; label: string; color: string }> = {
    harvested: { emoji: '🧺', label: 'Cosechado', color: 'var(--green-200)' },
    removed:   { emoji: '❌', label: 'Retirado',  color: 'var(--earth-400)' },
    failed:    { emoji: '💀', label: 'Perdido',   color: 'var(--alert)' },
  };
  const st = statusLabel[planting.status] ?? { emoji: '📝', label: planting.status, color: 'var(--earth-400)' };
  const stage = CROP_STAGES[planting.stage ?? 0];

  return (
    <div className="rounded-lg p-2.5" style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)', opacity: 0.7 }}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium" style={{ color: 'var(--earth-50)' }}>
          {planting.crop_name}
          {planting.variety && <span className="font-normal text-xs ml-1" style={{ color: 'var(--earth-400)' }}>{planting.variety}</span>}
        </span>
        <span className="text-xs shrink-0" style={{ color: st.color }}>{st.emoji} {st.label}</span>
      </div>
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <span className="text-xs" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
          {formatDate(planting.planted_date)} → {formatDate(planting.updated_at)}
        </span>
        <span style={{ background: stage.bg, color: stage.color, borderRadius: '999px', padding: '1px 7px', fontSize: '10px' }}>
          {stage.emoji} {stage.label}
        </span>
      </div>
      {planting.notes && (
        <p className="text-xs mt-1 mb-0 italic" style={{ color: 'var(--earth-400)' }}>{planting.notes}</p>
      )}
    </div>
  );
}

/* ── Bancal State Selector ── */
function BancalStateSelector({ bancal, onStateChange }: {
  bancal: Bancal;
  onStateChange: (newStatus: string) => void;
}) {
  const entries = Object.entries(BANCAL_STATES);
  return (
    <div className="flex gap-1 flex-wrap mb-4">
      {entries.map(([key, st]) => {
        const isCurrent = bancal.status === key;
        return (
          <button key={key} onClick={() => { if (!isCurrent) onStateChange(key); }}
            className="flex items-center gap-1 shrink-0 cursor-pointer border-none transition-all"
            style={{
              background: isCurrent ? st.bg : 'transparent',
              color: isCurrent ? st.color : 'var(--earth-600)',
              borderRadius: '999px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: isCurrent ? 600 : 400,
              border: isCurrent ? `1px solid ${st.color}` : '1px solid var(--earth-800)',
            }}>
            <span>{st.emoji}</span>
            <span>{st.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Bancal Detail ── */
function BancalDetail({ bancal }: { bancal: Bancal }) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { plantings, updatePlanting, refetch: refetchPlantings } = usePlantings(bancal.id);
  const { logs, addLog, refetch: refetchLogs } = useActivityLogs(bancal.id);
  const { updateBancalStatus, refetch: refetchBancales } = useBancales();
  const { getLabel: getWaterLabel } = useLastWatered(logs);
  const { show: showToast, element: toastEl } = useToast();
  const [showPlantingForm, setShowPlantingForm] = useState(false);
  const [showLogSheet, setShowLogSheet] = useState(false);
  const [finalizing, setFinalizing] = useState<{ id: string; status: 'harvested' | 'failed' | 'removed' } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [stateConfirm, setStateConfirm] = useState<string | null>(null);

  const activePlantings = plantings.filter((p) => p.status === 'active');
  const historyPlantings = plantings
    .filter((p) => p.status !== 'active')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  const recentLogs = logs.slice(0, 10);
  const badge = STATUS_BADGE[bancal.status] ?? { bg: 'var(--earth-200)', text: 'var(--earth-800)', label: bancal.status };

  const handleStageChange = async (id: string, newStage: number) => {
    const p = plantings.find((pl) => pl.id === id);
    if (!p) return;
    const oldStage = p.stage ?? 0;
    if (oldStage === newStage) return;
    await updatePlanting(id, { stage: newStage });
    await addLog({
      bancal_id: bancal.id,
      planting_id: id,
      action: 'observed',
      notes: `${p.crop_name}: ${CROP_STAGES[oldStage].label} → ${CROP_STAGES[newStage].label}`,
    });
    refetchPlantings();
    refetchLogs();
    const who = profile?.display_name ?? '';
    showToast(`${CROP_STAGES[newStage].emoji} ${p.crop_name}: ${CROP_STAGES[newStage].label}${who ? ` · ${who}` : ''}`, 'success');
  };

  const handleBancalStateChange = async (newStatus: string) => {
    if (activePlantings.length > 0 && newStatus !== 'planted') {
      setStateConfirm(newStatus);
      return;
    }
    await confirmBancalStateChange(newStatus);
  };

  const confirmBancalStateChange = async (newStatus: string) => {
    const oldLabel = BANCAL_STATES[bancal.status]?.label ?? bancal.status;
    const newLabel = BANCAL_STATES[newStatus]?.label ?? newStatus;
    await updateBancalStatus(bancal.id, newStatus as Bancal['status']);
    const who = profile?.display_name ?? '';
    await addLog({
      bancal_id: bancal.id,
      action: 'other',
      notes: `Estado: ${oldLabel} → ${newLabel}${who ? ` · ${who}` : ''}`,
    });
    setStateConfirm(null);
    refetchBancales();
    refetchLogs();
    showToast(`${BANCAL_STATES[newStatus]?.emoji ?? '📝'} ${bancal.name}: ${newLabel}`, 'success');
  };

  const handleFinalize = async (notes: string) => {
    if (!finalizing) return;
    const p = plantings.find((pl) => pl.id === finalizing.id);
    if (!p) return;

    await updatePlanting(finalizing.id, { status: finalizing.status });

    const config = FINALIZE_CONFIG[finalizing.status];
    const prefix = finalizing.status === 'harvested' ? 'Cosecha' : finalizing.status === 'removed' ? 'Retirado' : 'Pérdida';
    await addLog({
      bancal_id: bancal.id,
      planting_id: finalizing.id,
      action: config.action,
      notes: `${prefix}: ${p.crop_name}. ${notes}`,
    });

    const remaining = activePlantings.filter((pl) => pl.id !== finalizing.id);
    if (remaining.length === 0) {
      await updateBancalStatus(bancal.id, 'waiting_chickens');
    }

    setFinalizing(null);
    refetchPlantings();
    refetchLogs();
  };

  const finalizingPlanting = finalizing ? plantings.find((p) => p.id === finalizing.id) : null;

  const waterLabel = getWaterLabel(bancal.id);

  return (
    <div className="p-4 pb-8">
      {toastEl}

      <button onClick={() => navigate('/map')}
        className="text-sm mb-4 flex items-center gap-1"
        style={{ color: 'var(--green-200)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        ← Volver al mapa
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-2xl m-0" style={{ color: 'var(--earth-50)' }}>{bancal.name}</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-1"
          style={{ background: badge.bg, color: badge.text }}>{badge.label}</span>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <p className="text-xs m-0" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
          {bancal.length_m}m × {bancal.width_m}m · {bancal.irrigation_lines} línea{bancal.irrigation_lines > 1 ? 's' : ''} riego
          {bancal.irrigation_spacing_cm ? ` · goteo ${bancal.irrigation_spacing_cm}cm` : ''}
        </p>
        {waterLabel && (
          <span className="text-xs shrink-0" style={{ color: 'var(--water)', fontFamily: "'IBM Plex Mono', monospace" }}>
            💧 {waterLabel}
          </span>
        )}
      </div>

      {/* Bancal state selector */}
      <BancalStateSelector bancal={bancal} onStateChange={handleBancalStateChange} />

      {/* Active plantings */}
      <h3 className="text-base mb-3 mt-0" style={{ color: 'var(--earth-50)' }}>🌱 Plantaciones activas</h3>
      {activePlantings.length === 0 ? (
        <div className="rounded-lg p-4 mb-6 text-center" style={{ background: 'var(--earth-800)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--earth-400)' }}>Sin plantaciones activas</p>
          <button onClick={() => setShowPlantingForm(true)}
            className="text-sm font-medium px-4 py-2 rounded-lg border-none cursor-pointer"
            style={{ background: 'var(--green-400)', color: 'white' }}>+ Plantar</button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {activePlantings.map((p) => (
            <PlantingCard key={p.id} planting={p}
              onFinalize={(id, status) => setFinalizing({ id, status })}
              onStageChange={handleStageChange} />
          ))}
        </div>
      )}

      {/* Recent logs */}
      <h3 className="text-base mb-3 mt-0" style={{ color: 'var(--earth-50)' }}>📋 Últimas acciones</h3>
      {recentLogs.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--earth-400)' }}>Sin actividad registrada</p>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {recentLogs.map((log) => {
            const at = ACTION_TYPES[log.action] ?? { label: log.action, emoji: '📝', color: 'var(--earth-400)' };
            return (
              <div key={log.id} className="flex gap-3 items-start">
                <span className="text-base shrink-0 mt-0.5">{at.emoji}</span>
                <div className="min-w-0">
                  <span className="text-sm font-medium" style={{ color: 'var(--earth-50)' }}>{at.label}</span>
                  {log.notes && <p className="text-xs mt-0.5 mb-0" style={{ color: 'var(--earth-400)' }}>{log.notes}</p>}
                  <p className="text-xs mt-0.5 mb-0" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
                    {formatDateTime(log.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History section */}
      <div className="mb-6">
        <button onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 w-full text-left bg-transparent border-none cursor-pointer p-0 mb-2"
          style={{ color: 'var(--earth-400)' }}>
          <span className="text-base">{showHistory ? '▾' : '▸'}</span>
          <h3 className="text-base m-0" style={{ color: 'var(--earth-50)' }}>📜 Historial de cultivos</h3>
          {historyPlantings.length > 0 && (
            <span className="text-xs" style={{ color: 'var(--earth-400)' }}>({historyPlantings.length})</span>
          )}
        </button>
        {showHistory && (
          historyPlantings.length === 0 ? (
            <p className="text-xs pl-6" style={{ color: 'var(--earth-400)' }}>Sin cultivos anteriores</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {historyPlantings.map((p) => <HistoryCard key={p.id} planting={p} />)}
            </div>
          )
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-2">
        <button onClick={() => setShowPlantingForm(true)}
          className="flex-1 text-sm font-medium py-2.5 rounded-lg border-none cursor-pointer"
          style={{ background: 'var(--green-400)', color: 'white' }}>+ Plantar</button>
        <button onClick={() => setShowLogSheet(true)}
          className="flex-1 text-sm font-medium py-2.5 rounded-lg cursor-pointer"
          style={{ background: 'transparent', color: 'var(--earth-200)', border: '1px solid var(--earth-600)' }}>+ Registrar acción</button>
      </div>

      {/* Modals */}
      {showPlantingForm && (
        <PlantingForm bancalId={bancal.id} bancalName={bancal.name}
          onClose={() => setShowPlantingForm(false)}
          onSuccess={() => { setShowPlantingForm(false); refetchPlantings(); refetchLogs(); }} />
      )}
      {showLogSheet && (
        <LogActionSheet bancalId={bancal.id} bancalName={bancal.name}
          onClose={() => setShowLogSheet(false)}
          onSuccess={() => { setShowLogSheet(false); refetchLogs(); }} />
      )}
      {finalizing && finalizingPlanting && (
        <FinalizeModal planting={finalizingPlanting} status={finalizing.status}
          onConfirm={handleFinalize}
          onClose={() => setFinalizing(null)} />
      )}

      {/* State change confirm */}
      {stateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setStateConfirm(null)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
          <div className="relative rounded-xl p-5 max-w-xs w-full text-center mx-4"
            style={{ background: 'var(--earth-800)' }}
            onClick={(e) => e.stopPropagation()}>
            <p className="text-sm mb-2" style={{ color: 'var(--earth-50)' }}>
              ¿Cambiar {bancal.name} a {BANCAL_STATES[stateConfirm]?.emoji} {BANCAL_STATES[stateConfirm]?.label}?
            </p>
            {activePlantings.length > 0 && stateConfirm !== 'planted' && (
              <p className="text-xs mb-3" style={{ color: 'var(--orange-400)' }}>
                ⚠️ Este bancal tiene {activePlantings.length} cultivo{activePlantings.length > 1 ? 's' : ''} activo{activePlantings.length > 1 ? 's' : ''}
              </p>
            )}
            <div className="flex gap-2">
              <button onClick={() => setStateConfirm(null)}
                className="flex-1 py-2 rounded-lg text-sm cursor-pointer"
                style={{ background: 'transparent', border: '1px solid var(--earth-600)', color: 'var(--earth-200)' }}>
                Cancelar
              </button>
              <button onClick={() => confirmBancalStateChange(stateConfirm)}
                className="flex-1 py-2 rounded-lg text-sm font-medium border-none cursor-pointer"
                style={{ background: 'var(--green-600)', color: 'white' }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Bancal List ── */
function BancalList() {
  const { bancales } = useBancales();
  const { plantings } = usePlantings();
  const { logs } = useActivityLogs();
  const { getDays, getLabel } = useLastWatered(logs);

  const small = bancales.filter((b) => b.type === 'small');
  const large = bancales.filter((b) => b.type === 'large');
  const special = bancales.filter((b) => b.type === 'greenhouse' || b.type === 'patatal');

  const sortByStatus = (a: Bancal, b: Bancal) => {
    const order: Record<string, number> = { planted: 0, chickens: 1, waiting_chickens: 2, fallow: 3, post_chickens: 4, available: 5, empty: 6, resting: 7 };
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  };

  const getActivePlantings = (bancalId: string) =>
    plantings.filter((p) => p.bancal_id === bancalId && p.status === 'active');

  return (
    <div className="p-4 pb-8">
      <h2 className="text-2xl mb-4 mt-0" style={{ color: 'var(--earth-50)' }}>Bancales</h2>
      <BancalGroup title="Bancales pequeños (B1–B11)" bancales={[...small].sort(sortByStatus)} getActivePlantings={getActivePlantings} getWater={{ getDays, getLabel }} />
      <BancalGroup title="Bancales grandes (B12–B15)" bancales={[...large].sort(sortByStatus)} getActivePlantings={getActivePlantings} getWater={{ getDays, getLabel }} />
      <BancalGroup title="Zonas especiales" bancales={special} getActivePlantings={getActivePlantings} getWater={{ getDays, getLabel }} />
    </div>
  );
}

function BancalGroup({ title, bancales, getActivePlantings, getWater }: {
  title: string;
  bancales: Bancal[];
  getActivePlantings: (id: string) => Planting[];
  getWater: { getDays: (id: string) => number | null; getLabel: (id: string) => string | null };
}) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2 mt-0" style={{ color: 'var(--earth-400)' }}>{title}</h3>
      <div className="flex flex-col gap-2">
        {bancales.map((b) => {
          const badge = STATUS_BADGE[b.status] ?? { bg: 'var(--earth-200)', text: 'var(--earth-800)', label: b.status };
          const active = getActivePlantings(b.id);
          const wLabel = getWater.getLabel(b.id);
          const wDays = getWater.getDays(b.id);
          return (
            <Link key={b.id} to={`/bancal/${b.id}`}
              className="rounded-lg p-3 no-underline flex justify-between items-center"
              style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}>
              <div>
                <span className="font-semibold text-sm" style={{ color: 'var(--earth-50)' }}>{b.name}</span>
                {active.length > 0 && (
                  <span className="text-xs ml-2" style={{ color: 'var(--earth-400)' }}>
                    {active.map((p) => p.crop_name).join(', ')}
                  </span>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
                    {b.length_m}m × {b.width_m}m
                  </span>
                  {wLabel && (
                    <span className="text-xs" style={{
                      color: (wDays ?? 0) > 5 ? 'var(--orange-400)' : 'var(--water)',
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}>
                      💧 {wLabel}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: badge.bg, color: badge.text }}>{badge.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ── Page Router ── */
export function BancalPage() {
  const { id } = useParams();
  const { bancales, loading } = useBancales();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--green-400)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!id) return <BancalList />;

  const bancal = bancales.find((b) => b.id === id);
  if (!bancal) {
    return (
      <div className="p-4">
        <p className="text-sm" style={{ color: 'var(--alert)' }}>Bancal no encontrado</p>
        <Link to="/map" className="text-sm" style={{ color: 'var(--green-200)' }}>← Volver al mapa</Link>
      </div>
    );
  }

  return <BancalDetail bancal={bancal} />;
}
