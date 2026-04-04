import { useParams, useNavigate, Link } from 'react-router-dom';
import { BANCALES, MOCK_PLANTINGS, MOCK_LOGS, ACTION_TYPES } from '../lib/constants';
import type { Bancal } from '../lib/types';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  planted: { bg: 'var(--green-50)', text: 'var(--green-800)', label: 'Plantado' },
  empty:   { bg: 'var(--earth-200)', text: 'var(--earth-800)', label: 'Libre' },
  fallow:  { bg: 'var(--orange-50)', text: 'var(--orange-800)', label: 'Barbecho' },
  resting: { bg: 'var(--earth-200)', text: 'var(--earth-800)', label: 'Descanso' },
};

function BancalDetail({ bancal }: { bancal: Bancal }) {
  const navigate = useNavigate();
  const plantings = MOCK_PLANTINGS.filter((p) => p.bancal_id === bancal.id && p.status === 'active');
  const logs = MOCK_LOGS
    .filter((l) => l.bancal_id === bancal.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);
  const badge = STATUS_BADGE[bancal.status];

  return (
    <div className="p-4 pb-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/map')}
        className="text-sm mb-4 flex items-center gap-1"
        style={{ color: 'var(--green-200)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        ← Volver al mapa
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-2xl m-0" style={{ color: 'var(--earth-50)' }}>
          {bancal.name}
        </h2>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-1"
          style={{ background: badge.bg, color: badge.text }}
        >
          {badge.label}
        </span>
      </div>
      <p className="text-xs mb-6" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
        {bancal.length_m}m × {bancal.width_m}m · {bancal.irrigation_lines} línea{bancal.irrigation_lines > 1 ? 's' : ''} riego
        {bancal.irrigation_spacing_cm ? ` · goteo ${bancal.irrigation_spacing_cm}cm` : ''}
      </p>

      {/* Plantaciones activas */}
      <h3 className="text-base mb-3 mt-0" style={{ color: 'var(--earth-50)' }}>
        🌱 Plantaciones activas
      </h3>
      {plantings.length === 0 ? (
        <div className="rounded-lg p-4 mb-6 text-center" style={{ background: 'var(--earth-800)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--earth-400)' }}>Sin plantaciones activas</p>
          <button
            className="text-sm font-medium px-4 py-2 rounded-lg border-none cursor-pointer"
            style={{ background: 'var(--green-400)', color: 'white' }}
          >
            + Plantar
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {plantings.map((p) => (
            <div key={p.id} className="rounded-lg p-3" style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold text-sm" style={{ color: 'var(--earth-50)' }}>
                    {p.crop_name}
                  </span>
                  {p.variety && (
                    <span className="text-xs ml-2" style={{ color: 'var(--earth-400)' }}>
                      {p.variety}
                    </span>
                  )}
                </div>
                <span className="text-xs shrink-0" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
                  ×{p.quantity}
                </span>
              </div>
              <p className="text-xs mt-1 mb-0" style={{ color: 'var(--earth-400)' }}>
                Plantado {formatDate(p.planted_date)}
              </p>
              {p.notes && (
                <p className="text-xs mt-1 mb-0 italic" style={{ color: 'var(--earth-400)' }}>
                  {p.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Últimas acciones */}
      <h3 className="text-base mb-3 mt-0" style={{ color: 'var(--earth-50)' }}>
        📋 Últimas acciones
      </h3>
      {logs.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--earth-400)' }}>Sin actividad registrada</p>
      ) : (
        <div className="flex flex-col gap-2 mb-6">
          {logs.map((log) => {
            const at = ACTION_TYPES[log.action];
            return (
              <div key={log.id} className="flex gap-3 items-start">
                <span className="text-base shrink-0 mt-0.5">{at.emoji}</span>
                <div className="min-w-0">
                  <span className="text-sm font-medium" style={{ color: 'var(--earth-50)' }}>
                    {at.label}
                  </span>
                  {log.notes && (
                    <p className="text-xs mt-0.5 mb-0" style={{ color: 'var(--earth-400)' }}>
                      {log.notes}
                    </p>
                  )}
                  <p className="text-xs mt-0.5 mb-0" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
                    {formatDateTime(log.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-2">
        <button
          className="flex-1 text-sm font-medium py-2.5 rounded-lg border-none cursor-pointer"
          style={{ background: 'var(--green-400)', color: 'white' }}
        >
          + Plantar
        </button>
        <button
          className="flex-1 text-sm font-medium py-2.5 rounded-lg cursor-pointer"
          style={{ background: 'transparent', color: 'var(--earth-200)', border: '1px solid var(--earth-600)' }}
        >
          + Registrar acción
        </button>
      </div>
    </div>
  );
}

function BancalList() {
  const small = BANCALES.filter((b) => b.type === 'small');
  const large = BANCALES.filter((b) => b.type === 'large');
  const special = BANCALES.filter((b) => b.type === 'greenhouse' || b.type === 'patatal');

  const sortByStatus = (a: Bancal, b: Bancal) => {
    const order: Record<string, number> = { planted: 0, fallow: 1, empty: 2, resting: 3 };
    return (order[a.status] ?? 9) - (order[b.status] ?? 9);
  };

  return (
    <div className="p-4 pb-8">
      <h2 className="text-2xl mb-4 mt-0" style={{ color: 'var(--earth-50)' }}>Bancales</h2>

      <BancalGroup title="Bancales pequeños (B1–B11)" bancales={[...small].sort(sortByStatus)} />
      <BancalGroup title="Bancales grandes (B12–B15)" bancales={[...large].sort(sortByStatus)} />
      <BancalGroup title="Zonas especiales" bancales={special} />
    </div>
  );
}

function BancalGroup({ title, bancales }: { title: string; bancales: Bancal[] }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2 mt-0" style={{ color: 'var(--earth-400)' }}>
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {bancales.map((b) => {
          const badge = STATUS_BADGE[b.status];
          const activePlantings = MOCK_PLANTINGS.filter((p) => p.bancal_id === b.id && p.status === 'active');
          return (
            <Link
              key={b.id}
              to={`/bancal/${b.id}`}
              className="rounded-lg p-3 no-underline flex justify-between items-center"
              style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}
            >
              <div>
                <span className="font-semibold text-sm" style={{ color: 'var(--earth-50)' }}>
                  {b.name}
                </span>
                {activePlantings.length > 0 && (
                  <span className="text-xs ml-2" style={{ color: 'var(--earth-400)' }}>
                    {activePlantings.map((p) => p.crop_name).join(', ')}
                  </span>
                )}
                <p className="text-xs mt-0.5 mb-0" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
                  {b.length_m}m × {b.width_m}m
                </p>
              </div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{ background: badge.bg, color: badge.text }}
              >
                {badge.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function BancalPage() {
  const { id } = useParams();

  // No ID → show list
  if (!id) return <BancalList />;

  // Find bancal
  const bancal = BANCALES.find((b) => b.id === id);
  if (!bancal) {
    return (
      <div className="p-4">
        <p className="text-sm" style={{ color: 'var(--alert)' }}>Bancal no encontrado</p>
        <Link to="/map" className="text-sm" style={{ color: 'var(--green-200)' }}>
          ← Volver al mapa
        </Link>
      </div>
    );
  }

  return <BancalDetail bancal={bancal} />;
}
