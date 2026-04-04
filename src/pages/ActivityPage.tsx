import { Link } from 'react-router-dom';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { useBancales } from '../hooks/useBancales';
import { ACTION_TYPES } from '../lib/constants';

function formatDayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export function ActivityPage() {
  const { logs, loading } = useActivityLogs();
  const { bancales } = useBancales();

  // Group by day
  const grouped: { day: string; logs: typeof logs }[] = [];
  for (const log of logs) {
    const day = new Date(log.created_at).toDateString();
    const last = grouped[grouped.length - 1];
    if (last && last.day === day) {
      last.logs.push(log);
    } else {
      grouped.push({ day, logs: [log] });
    }
  }

  return (
    <div className="p-4 pb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-2xl m-0" style={{ color: 'var(--earth-50)' }}>Actividad</h2>
        <span className="text-xs" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
          {logs.length} registros
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--green-400)', borderTopColor: 'transparent' }} />
        </div>
      ) : logs.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--earth-400)' }}>Sin actividad registrada</p>
      ) : (
        <div className="relative">
          <div className="absolute top-0 bottom-0 w-px" style={{ left: '11px', background: 'var(--earth-800)' }} />

          {grouped.map((group) => (
            <div key={group.day} className="mb-4">
              <div className="relative flex items-center mb-3 pl-8">
                <span className="text-xs font-semibold" style={{ color: 'var(--earth-400)' }}>
                  {formatDayLabel(group.logs[0].created_at)}
                </span>
              </div>

              {group.logs.map((log) => {
                const at = ACTION_TYPES[log.action];
                const bancal = bancales.find((b) => b.id === log.bancal_id);

                return (
                  <div key={log.id} className="relative flex items-start gap-3 mb-3 pl-0">
                    <div className="relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
                      style={{ background: at.color }}>
                      <span className="text-xs leading-none">{at.emoji}</span>
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: 'var(--earth-50)' }}>{at.label}</span>
                        {bancal && (
                          <Link to={`/bancal/${bancal.id}`}
                            className="text-xs font-medium px-1.5 py-0.5 rounded no-underline"
                            style={{ background: 'var(--earth-800)', color: 'var(--green-200)', border: '1px solid var(--earth-600)' }}>
                            {bancal.name}
                          </Link>
                        )}
                      </div>
                      {log.notes && (
                        <p className="text-xs mt-0.5 mb-0" style={{ color: 'var(--earth-400)' }}>{log.notes}</p>
                      )}
                      <p className="text-xs mt-0.5 mb-0"
                        style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace", opacity: 0.7 }}>
                        {formatTime(log.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
