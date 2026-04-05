import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBancales } from '../hooks/useBancales';
import { usePlantings } from '../hooks/usePlantings';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { COMUNEROS, APP_VERSION } from '../lib/constants';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toast';
import { useActivityLogs as useLogsForReport } from '../hooks/useActivityLogs';

export function SettingsPage() {
  const { profile, selectProfile, signOut } = useAuth();
  const { bancales } = useBancales();
  const { plantings } = usePlantings();
  const { logs } = useActivityLogs();
  const { addLog: addBugLog } = useLogsForReport();
  const { show: showToast, element: toastEl } = useToast();
  const [exporting, setExporting] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);
  const [bugText, setBugText] = useState('');
  const [sendingBug, setSendingBug] = useState(false);

  const activePlantings = plantings.filter((p) => p.status === 'active').length;

  const handleBugReport = async () => {
    if (!bugText.trim()) return;
    setSendingBug(true);
    const info = [
      `🐛 BUG: ${bugText}`,
      `📱 ${navigator.userAgent}`,
      `📐 ${window.innerWidth}x${window.innerHeight}`,
      `👤 ${profile?.display_name ?? 'anónimo'}`,
      `🕐 ${new Date().toISOString()}`,
      `📌 v${APP_VERSION}`,
    ].join('\n');
    await addBugLog({ bancal_id: 'B1', action: 'other', notes: info });
    setSendingBug(false);
    setShowBugReport(false);
    setBugText('');
    showToast('Reporte enviado. ¡Gracias!', 'success');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      let bData = bancales;
      let pData = plantings;
      let lData = logs;

      if (supabase) {
        const [bRes, pRes, lRes] = await Promise.all([
          supabase.from('bancales').select('*'),
          supabase.from('plantings').select('*'),
          supabase.from('activity_logs').select('*').order('created_at', { ascending: false }),
        ]);
        if (bRes.data) bData = bRes.data;
        if (pRes.data) pData = pRes.data;
        if (lRes.data) lData = lRes.data;
      }

      const exportData = {
        exported_at: new Date().toISOString(),
        bancales: bData,
        plantings: pData,
        activity_logs: lData,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const date = new Date().toISOString().split('T')[0];
      const a = document.createElement('a');
      a.href = url;
      a.download = `huerta-backup-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Datos exportados', 'success');
    } catch {
      showToast('Error al exportar', 'warning');
    }
    setExporting(false);
  };

  return (
    <div className="p-4 pb-8">
      {toastEl}
      <h2 className="text-2xl mb-6 mt-0" style={{ color: 'var(--earth-50)' }}>Ajustes</h2>

      {/* Comunero selector */}
      <div className="rounded-lg p-4 mb-4" style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)' }}>
        <h3 className="text-sm font-semibold mt-0 mb-3" style={{ color: 'var(--earth-400)' }}>¿Quién eres?</h3>
        <div className="grid grid-cols-2 gap-2">
          {COMUNEROS.map((c) => {
            const selected = profile?.id === c.id;
            return (
              <button key={c.id} onClick={() => selectProfile(c.id)}
                className="flex items-center gap-2 rounded-lg p-2.5 cursor-pointer border-none transition-all"
                style={{
                  background: selected ? 'var(--earth-900)' : 'transparent',
                  border: selected ? `2px solid ${c.avatar_color}` : '1px solid var(--earth-600)',
                }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                  style={{ background: c.avatar_color, color: 'white' }}>
                  {c.display_name[0]}
                </div>
                <span className="text-sm font-medium" style={{ color: selected ? 'var(--earth-50)' : 'var(--earth-400)' }}>
                  {c.display_name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
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

      {/* Export */}
      <button onClick={handleExport} disabled={exporting}
        className="w-full py-2.5 rounded-lg text-sm font-medium cursor-pointer mb-3"
        style={{ background: 'var(--earth-800)', border: '1px solid var(--earth-600)', color: 'var(--earth-200)', opacity: exporting ? 0.6 : 1 }}>
        {exporting ? 'Exportando...' : '📥 Exportar datos (JSON)'}
      </button>

      {/* Bug report */}
      <button onClick={() => setShowBugReport(true)}
        className="w-full py-2.5 rounded-lg text-sm font-medium cursor-pointer mb-3"
        style={{ background: 'var(--earth-800)', border: '1px solid var(--orange-600)', color: 'var(--orange-200)' }}>
        🐛 Reportar un problema
      </button>

      {/* Sign out */}
      <button onClick={signOut}
        className="w-full py-2.5 rounded-lg text-sm font-medium cursor-pointer mb-4"
        style={{ background: 'transparent', border: '1px solid var(--earth-600)', color: 'var(--earth-400)' }}>
        Cambiar de comunero
      </button>

      <p className="text-center text-xs mt-6" style={{ color: 'var(--earth-600)' }}>
        CotoControl v{APP_VERSION}
      </p>

      {/* Bug report modal */}
      {showBugReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowBugReport(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
          <div className="relative rounded-xl p-5 max-w-sm w-full mx-4"
            style={{ background: 'var(--earth-800)' }}
            onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base m-0 mb-3" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}>
              🐛 Reportar problema
            </h3>
            <textarea value={bugText} onChange={(e) => setBugText(e.target.value)} rows={4}
              placeholder="Describe qué ha pasado o qué no funciona..."
              className="w-full rounded-lg px-3 py-2.5 outline-none resize-none mb-3 text-base"
              style={{ background: 'var(--earth-900)', border: '1px solid var(--earth-600)', color: 'var(--earth-50)', fontSize: '16px' }} />
            <div className="flex gap-2">
              <button onClick={() => setShowBugReport(false)}
                className="flex-1 py-2 rounded-lg text-sm cursor-pointer"
                style={{ background: 'transparent', border: '1px solid var(--earth-600)', color: 'var(--earth-200)' }}>
                Cancelar
              </button>
              <button onClick={handleBugReport} disabled={sendingBug || !bugText.trim()}
                className="flex-1 py-2 rounded-lg text-sm font-medium border-none cursor-pointer"
                style={{ background: sendingBug ? 'var(--earth-600)' : 'var(--orange-400)', color: 'white', opacity: sendingBug || !bugText.trim() ? 0.6 : 1 }}>
                {sendingBug ? 'Enviando...' : 'Enviar reporte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
