import { useAuth } from '../hooks/useAuth';
import { useBancales } from '../hooks/useBancales';
import { usePlantings } from '../hooks/usePlantings';
import { useActivityLogs } from '../hooks/useActivityLogs';

export function SettingsPage() {
  const { profile, signOut } = useAuth();
  const { bancales } = useBancales();
  const { plantings } = usePlantings();
  const { logs } = useActivityLogs();

  const activePlantings = plantings.filter((p) => p.status === 'active').length;

  return (
    <div className="p-4 pb-8">
      <h2 className="text-2xl mb-6 mt-0" style={{ color: 'var(--earth-50)' }}>Ajustes</h2>

      {/* Profile section */}
      <div className="rounded-lg p-4 mb-4" style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}>
        <h3 className="text-sm font-semibold mt-0 mb-3" style={{ color: 'var(--earth-400)' }}>Perfil</h3>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold shrink-0"
            style={{ background: profile?.avatar_color ?? '#5A9A22', color: 'white' }}
          >
            {profile?.display_name?.[0] ?? '?'}
          </div>
          <div>
            <p className="text-base font-medium m-0" style={{ color: 'var(--earth-50)' }}>
              {profile?.display_name ?? '—'}
            </p>
            <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--earth-400)' }}>
              Comunero
            </p>
          </div>
        </div>
      </div>

      {/* Huerta stats */}
      <div className="rounded-lg p-4 mb-4" style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}>
        <h3 className="text-sm font-semibold mt-0 mb-3" style={{ color: 'var(--earth-400)' }}>La huerta</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-semibold m-0" style={{ color: 'var(--earth-50)', fontFamily: "'IBM Plex Mono', monospace" }}>
              {bancales.length}
            </p>
            <p className="text-xs m-0" style={{ color: 'var(--earth-400)' }}>bancales</p>
          </div>
          <div>
            <p className="text-xl font-semibold m-0" style={{ color: 'var(--green-200)', fontFamily: "'IBM Plex Mono', monospace" }}>
              {activePlantings}
            </p>
            <p className="text-xs m-0" style={{ color: 'var(--earth-400)' }}>plantaciones</p>
          </div>
          <div>
            <p className="text-xl font-semibold m-0" style={{ color: 'var(--water)', fontFamily: "'IBM Plex Mono', monospace" }}>
              {logs.length}
            </p>
            <p className="text-xs m-0" style={{ color: 'var(--earth-400)' }}>registros</p>
          </div>
        </div>
      </div>

      {/* Change profile */}
      <button onClick={signOut}
        className="w-full py-2.5 rounded-lg text-sm font-medium cursor-pointer mb-4"
        style={{ background: 'transparent', border: '1px solid var(--earth-600)', color: 'var(--earth-200)' }}>
        Cambiar de comunero
      </button>

      {/* Version */}
      <p className="text-center text-xs mt-6" style={{ color: 'var(--earth-600)' }}>
        Huerta Tracker v0.2
      </p>
    </div>
  );
}
