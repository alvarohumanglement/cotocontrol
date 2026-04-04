import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBancales } from '../hooks/useBancales';
import { usePlantings } from '../hooks/usePlantings';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { ACTION_TYPES } from '../lib/constants';
import { PlantingForm } from '../components/bancal/PlantingForm';
import { LogActionSheet } from '../components/bancal/LogActionSheet';
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

/* ── Planting Card with harvest actions ── */
function PlantingCard({ planting, onStatusChange }: {
  planting: Planting;
  onStatusChange: (id: string, status: 'harvested' | 'failed' | 'removed') => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}>
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <span className="font-semibold text-sm" style={{ color: 'var(--earth-50)' }}>
            {planting.crop_name}
          </span>
          {planting.variety && (
            <span className="text-xs ml-2" style={{ color: 'var(--earth-400)' }}>
              {planting.variety}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
            ×{planting.quantity}
          </span>
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-base leading-none bg-transparent border-none cursor-pointer p-0"
            title="Acciones"
          >
            🧺
          </button>
        </div>
      </div>
      <p className="text-xs mt-1 mb-0" style={{ color: 'var(--earth-400)' }}>
        Plantado {formatDate(planting.planted_date)}
      </p>
      {planting.notes && (
        <p className="text-xs mt-1 mb-0 italic" style={{ color: 'var(--earth-400)' }}>
          {planting.notes}
        </p>
      )}

      {/* Contextual actions */}
      {showActions && (
        <div className="flex gap-2 mt-2 pt-2" style={{ borderTop: '1px solid var(--earth-600)' }}>
          <button onClick={() => onStatusChange(planting.id, 'harvested')}
            className="flex-1 text-xs py-1.5 rounded cursor-pointer border-none"
            style={{ background: 'var(--green-900)', color: 'var(--green-200)' }}>
            🧺 Cosechar
          </button>
          <button onClick={() => onStatusChange(planting.id, 'failed')}
            className="flex-1 text-xs py-1.5 rounded cursor-pointer border-none"
            style={{ background: 'var(--alert-light)', color: 'var(--alert)' }}>
            ❌ Falló
          </button>
          <button onClick={() => onStatusChange(planting.id, 'removed')}
            className="flex-1 text-xs py-1.5 rounded cursor-pointer border-none"
            style={{ background: 'var(--earth-900)', color: 'var(--earth-400)' }}>
            🗑️ Retirar
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Bancal Detail ── */
function BancalDetail({ bancal }: { bancal: Bancal }) {
  const navigate = useNavigate();
  const { plantings, updatePlanting, refetch: refetchPlantings } = usePlantings(bancal.id);
  const { logs, addLog, refetch: refetchLogs } = useActivityLogs(bancal.id);
  const { updateBancalStatus } = useBancales();
  const [showPlantingForm, setShowPlantingForm] = useState(false);
  const [showLogSheet, setShowLogSheet] = useState(false);
  const [confirm, setConfirm] = useState<{ id: string; status: 'harvested' | 'failed' | 'removed' } | null>(null);

  const activePlantings = plantings.filter((p) => p.status === 'active');
  const recentLogs = logs.slice(0, 10);
  const badge = STATUS_BADGE[bancal.status] ?? { bg: 'var(--earth-200)', text: 'var(--earth-800)', label: bancal.status };

  const handleStatusChange = (id: string, status: 'harvested' | 'failed' | 'removed') => {
    setConfirm({ id, status });
  };

  const confirmStatusChange = async () => {
    if (!confirm) return;
    const p = plantings.find((pl) => pl.id === confirm.id);
    await updatePlanting(confirm.id, { status: confirm.status });

    const labels = { harvested: 'Cosechado', failed: 'Falló', removed: 'Retirado' };
    await addLog({
      bancal_id: bancal.id,
      planting_id: confirm.id,
      action: confirm.status === 'harvested' ? 'harvested' : 'other',
      notes: `${labels[confirm.status]}: ${p?.crop_name ?? ''}`,
    });

    // If no active plantings left, mark bancal empty
    const remaining = activePlantings.filter((pl) => pl.id !== confirm.id);
    if (remaining.length === 0) {
      await updateBancalStatus(bancal.id, 'empty');
    }

    setConfirm(null);
    refetchPlantings();
    refetchLogs();
  };

  return (
    <div className="p-4 pb-8">
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
      <p className="text-xs mb-6" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
        {bancal.length_m}m × {bancal.width_m}m · {bancal.irrigation_lines} línea{bancal.irrigation_lines > 1 ? 's' : ''} riego
        {bancal.irrigation_spacing_cm ? ` · goteo ${bancal.irrigation_spacing_cm}cm` : ''}
      </p>

      {/* Plantaciones */}
      <h3 className="text-base mb-3 mt-0" style={{ color: 'var(--earth-50)' }}>🌱 Plantaciones activas</h3>
      {activePlantings.length === 0 ? (
        <div className="rounded-lg p-4 mb-6 text-center" style={{ background: 'var(--earth-800)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--earth-400)' }}>Sin plantaciones activas</p>
          <button onClick={() => setShowPlantingForm(true)}
            className="text-sm font-medium px-4 py-2 rounded-lg border-none cursor-pointer"
            style={{ background: 'var(--green-400)', color: 'white' }}>
            + Plantar
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {activePlantings.map((p) => (
            <PlantingCard key={p.id} planting={p} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}

      {/* Últimas acciones */}
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

      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <button onClick={() => setShowPlantingForm(true)}
          className="flex-1 text-sm font-medium py-2.5 rounded-lg border-none cursor-pointer"
          style={{ background: 'var(--green-400)', color: 'white' }}>
          + Plantar
        </button>
        <button onClick={() => setShowLogSheet(true)}
          className="flex-1 text-sm font-medium py-2.5 rounded-lg cursor-pointer"
          style={{ background: 'transparent', color: 'var(--earth-200)', border: '1px solid var(--earth-600)' }}>
          + Registrar acción
        </button>
      </div>

      {/* Modals */}
      {showPlantingForm && (
        <PlantingForm
          bancalId={bancal.id}
          bancalName={bancal.name}
          onClose={() => setShowPlantingForm(false)}
          onSuccess={() => { setShowPlantingForm(false); refetchPlantings(); refetchLogs(); }}
        />
      )}
      {showLogSheet && (
        <LogActionSheet
          bancalId={bancal.id}
          bancalName={bancal.name}
          onClose={() => setShowLogSheet(false)}
          onSuccess={() => { setShowLogSheet(false); refetchLogs(); }}
        />
      )}

      {/* Confirm dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setConfirm(null)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
          <div className="relative rounded-xl p-5 max-w-xs w-full text-center"
            style={{ background: 'var(--earth-800)' }}
            onClick={(e) => e.stopPropagation()}>
            <p className="text-sm mb-4" style={{ color: 'var(--earth-50)' }}>
              ¿Marcar como {confirm.status === 'harvested' ? 'cosechado' : confirm.status === 'failed' ? 'fallido' : 'retirado'}?
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirm(null)}
                className="flex-1 py-2 rounded-lg text-sm cursor-pointer"
                style={{ background: 'transparent', border: '1px solid var(--earth-600)', color: 'var(--earth-200)' }}>
                Cancelar
              </button>
              <button onClick={confirmStatusChange}
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

  const small = bancales.filter((b) => b.type === 'small');
  const large = bancales.filter((b) => b.type === 'large');
  const special = bancales.filter((b) => b.type === 'greenhouse' || b.type === 'patatal');

  const sortByStatus = (a: Bancal, b: Bancal) => {
    const order: Record<string, number> = { planted: 0, fallow: 1, empty: 2, resting: 3 };
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  };

  const getActivePlantings = (bancalId: string) =>
    plantings.filter((p) => p.bancal_id === bancalId && p.status === 'active');

  return (
    <div className="p-4 pb-8">
      <h2 className="text-2xl mb-4 mt-0" style={{ color: 'var(--earth-50)' }}>Bancales</h2>
      <BancalGroup title="Bancales pequeños (B1–B11)" bancales={[...small].sort(sortByStatus)} getActivePlantings={getActivePlantings} />
      <BancalGroup title="Bancales grandes (B12–B15)" bancales={[...large].sort(sortByStatus)} getActivePlantings={getActivePlantings} />
      <BancalGroup title="Zonas especiales" bancales={special} getActivePlantings={getActivePlantings} />
    </div>
  );
}

function BancalGroup({ title, bancales, getActivePlantings }: {
  title: string;
  bancales: Bancal[];
  getActivePlantings: (id: string) => Planting[];
}) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2 mt-0" style={{ color: 'var(--earth-400)' }}>{title}</h3>
      <div className="flex flex-col gap-2">
        {bancales.map((b) => {
          const badge = STATUS_BADGE[b.status];
          const active = getActivePlantings(b.id);
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
                <p className="text-xs mt-0.5 mb-0" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
                  {b.length_m}m × {b.width_m}m
                </p>
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
