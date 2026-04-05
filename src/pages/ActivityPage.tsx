import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { useBancales } from '../hooks/useBancales';
import { ACTION_TYPES, COMUNEROS } from '../lib/constants';
import { useToast } from '../components/ui/Toast';
import type { ActionType } from '../lib/types';

function formatDayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export function ActivityPage() {
  const { logs, loading, deleteLog, refetch } = useActivityLogs();
  const { bancales } = useBancales();
  const { show: showToast, element: toastEl } = useToast();
  const [filterBancal, setFilterBancal] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterActions, setFilterActions] = useState<Set<ActionType>>(new Set());
  const [filterComunero, setFilterComunero] = useState<string | null>(null);

  const toggleAction = (a: ActionType) => {
    setFilterActions((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a); else next.add(a);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (filterBancal && log.bancal_id !== filterBancal) return false;
      if (filterActions.size > 0 && !filterActions.has(log.action)) return false;
      if (filterComunero && log.created_by !== filterComunero) return false;
      return true;
    });
  }, [logs, filterBancal, filterActions, filterComunero]);

  // Group by day
  const grouped: { day: string; logs: typeof filtered }[] = [];
  for (const log of filtered) {
    const day = new Date(log.created_at).toDateString();
    const last = grouped[grouped.length - 1];
    if (last && last.day === day) {
      last.logs.push(log);
    } else {
      grouped.push({ day, logs: [log] });
    }
  }

  const actionEntries = Object.entries(ACTION_TYPES) as [ActionType, (typeof ACTION_TYPES)[ActionType]][];

  const confirmDeleteLog = async () => {
    if (!deleteConfirm) return;
    await deleteLog(deleteConfirm);
    setDeleteConfirm(null);
    refetch();
    showToast('Registro eliminado', 'success');
  };

  return (
    <div className="p-4 pb-8">
      {toastEl}
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-2xl m-0" style={{ color: 'var(--earth-50)' }}>Actividad</h2>
        <span className="text-xs" style={{ color: 'var(--earth-400)', fontFamily: "'IBM Plex Mono', monospace" }}>
          {filtered.length} de {logs.length}
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 mb-4">
        {/* Bancal filter */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          <button onClick={() => setFilterBancal(null)}
            className="shrink-0 text-xs px-2 py-1 rounded-full cursor-pointer border-none"
            style={{ background: !filterBancal ? 'var(--green-900)' : 'var(--earth-800)', color: !filterBancal ? 'var(--green-200)' : 'var(--earth-400)' }}>
            Todos
          </button>
          {bancales.map((b) => (
            <button key={b.id} onClick={() => setFilterBancal(b.id === filterBancal ? null : b.id)}
              className="shrink-0 text-xs px-2 py-1 rounded-full cursor-pointer border-none"
              style={{ background: filterBancal === b.id ? 'var(--green-900)' : 'var(--earth-800)', color: filterBancal === b.id ? 'var(--green-200)' : 'var(--earth-400)' }}>
              {b.id}
            </button>
          ))}
        </div>

        {/* Action filter */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {actionEntries.map(([key, at]) => (
            <button key={key} onClick={() => toggleAction(key)}
              className="shrink-0 text-xs px-2 py-1 rounded-full cursor-pointer border-none"
              style={{ background: filterActions.has(key) ? 'var(--earth-900)' : 'var(--earth-800)', color: filterActions.has(key) ? at.color : 'var(--earth-400)', border: filterActions.has(key) ? `1px solid ${at.color}` : '1px solid transparent' }}>
              {at.emoji} {at.label}
            </button>
          ))}
        </div>

        {/* Comunero filter */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          <button onClick={() => setFilterComunero(null)}
            className="shrink-0 text-xs px-2 py-1 rounded-full cursor-pointer border-none"
            style={{ background: !filterComunero ? 'var(--green-900)' : 'var(--earth-800)', color: !filterComunero ? 'var(--green-200)' : 'var(--earth-400)' }}>
            Todos
          </button>
          {COMUNEROS.map((c) => (
            <button key={c.id} onClick={() => setFilterComunero(c.id === filterComunero ? null : c.id)}
              className="shrink-0 text-xs px-2 py-1 rounded-full cursor-pointer border-none"
              style={{ background: filterComunero === c.id ? c.avatar_color : 'var(--earth-800)', color: filterComunero === c.id ? 'white' : 'var(--earth-400)' }}>
              {c.display_name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--green-400)', borderTopColor: 'transparent' }} />
        </div>
      ) : filtered.length === 0 ? (
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
                const at = ACTION_TYPES[log.action] ?? { label: log.action, emoji: '📝', color: 'var(--earth-400)' };
                const bancal = bancales.find((b) => b.id === log.bancal_id);
                const comunero = log.created_by ? COMUNEROS.find((c) => c.id === log.created_by) : null;

                return (
                  <div key={log.id} className="relative flex items-start gap-3 mb-3 pl-0">
                    <div className="relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
                      style={{ background: comunero?.avatar_color ?? at.color }}>
                      <span className="text-xs leading-none">{at.emoji}</span>
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        {comunero && (
                          <span className="text-xs font-semibold" style={{ color: comunero.avatar_color }}>
                            {comunero.display_name}
                          </span>
                        )}
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
                    <button onClick={() => setDeleteConfirm(log.id)}
                      className="shrink-0 bg-transparent border-none cursor-pointer p-1 rounded"
                      style={{ color: 'var(--earth-400)', opacity: 0.5, minWidth: 32, minHeight: 32 }}>
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
          <div className="relative rounded-xl p-5 max-w-xs w-full text-center mx-4"
            style={{ background: 'var(--earth-800)' }}
            onClick={(e) => e.stopPropagation()}>
            <p className="text-sm mb-3" style={{ color: 'var(--earth-50)' }}>¿Eliminar este registro?</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-lg text-sm cursor-pointer"
                style={{ background: 'transparent', border: '1px solid var(--earth-600)', color: 'var(--earth-200)' }}>
                Cancelar
              </button>
              <button onClick={confirmDeleteLog}
                className="flex-1 py-2 rounded-lg text-sm font-medium border-none cursor-pointer"
                style={{ background: 'var(--alert)', color: 'white' }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
