import { Link } from 'react-router-dom';
import { MOCK_LOGS, ACTION_TYPES, BANCALES } from '../lib/constants';

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export function ActivityPage() {
  const sorted = [...MOCK_LOGS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Group by day
  const grouped: { day: string; logs: typeof sorted }[] = [];
  for (const log of sorted) {
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
        <h2 className="text-2xl m-0" style={{ color: 'var(--earth-50)' }}>
          Actividad
        </h2>
        <span className="text-xs" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
          {sorted.length} registros
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ left: '11px', background: 'var(--earth-800)' }}
        />

        {grouped.map((group) => (
          <div key={group.day} className="mb-4">
            {/* Day separator */}
            <div className="relative flex items-center mb-3 pl-8">
              <span className="text-xs font-semibold" style={{ color: 'var(--earth-400)' }}>
                {formatDayLabel(group.logs[0].created_at)}
              </span>
            </div>

            {group.logs.map((log) => {
              const at = ACTION_TYPES[log.action];
              const bancal = BANCALES.find((b) => b.id === log.bancal_id);

              return (
                <div key={log.id} className="relative flex items-start gap-3 mb-3 pl-0">
                  {/* Timeline dot */}
                  <div
                    className="relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
                    style={{ background: at.color }}
                  >
                    <span className="text-xs leading-none">{at.emoji}</span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium" style={{ color: 'var(--earth-50)' }}>
                        {at.label}
                      </span>
                      {bancal && (
                        <Link
                          to={`/bancal/${bancal.id}`}
                          className="text-xs font-medium px-1.5 py-0.5 rounded no-underline"
                          style={{ background: 'var(--earth-800)', color: 'var(--green-200)', border: '1px solid var(--earth-600)' }}
                        >
                          {bancal.name}
                        </Link>
                      )}
                    </div>
                    {log.notes && (
                      <p className="text-xs mt-0.5 mb-0" style={{ color: 'var(--earth-400)' }}>
                        {log.notes}
                      </p>
                    )}
                    <p
                      className="text-xs mt-0.5 mb-0"
                      style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace", opacity: 0.7 }}
                    >
                      {formatTime(log.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
