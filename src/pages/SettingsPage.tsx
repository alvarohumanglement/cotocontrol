import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBancales } from '../hooks/useBancales';
import { usePlantings } from '../hooks/usePlantings';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { COMUNEROS, APP_VERSION } from '../lib/constants';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/Toast';
import { FeedbackSheet } from '../components/ui/FeedbackSheet';

export function SettingsPage() {
  const { profile, selectProfile, signOut } = useAuth();
  const { bancales } = useBancales();
  const { plantings } = usePlantings();
  const { logs } = useActivityLogs();
  const { show: showToast, element: toastEl } = useToast();
  const [exporting, setExporting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const activePlantings = plantings.filter((p) => p.status === 'active').length;

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
      a.download = `cotocontrol-backup-${date}.json`;
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

      {/* Feedback */}
      <button onClick={() => setShowFeedback(true)}
        className="w-full py-2.5 rounded-lg text-sm font-medium cursor-pointer mb-3"
        style={{ background: 'var(--earth-800)', border: '1px solid var(--green-600)', color: 'var(--green-200)' }}>
        📝 Enviar feedback
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

      {/* Feedback sheet */}
      {showFeedback && (
        <FeedbackSheet
          onClose={() => setShowFeedback(false)}
          onSuccess={() => { setShowFeedback(false); showToast('¡Gracias! Tu nota fue enviada', 'success'); }}
        />
      )}
    </div>
  );
}
