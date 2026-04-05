import { useState } from 'react';
import HuertaMapSVG from '../components/map/HuertaMapSVG';
import { useBancales } from '../hooks/useBancales';
import { usePlantings } from '../hooks/usePlantings';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { useLastWatered } from '../hooks/useLastWatered';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

export function MapPage() {
  const { profile } = useAuth();
  const { bancales, loading: bLoading, error: bError } = useBancales();
  const { plantings, loading: pLoading } = usePlantings();
  const { logs, addLog, refetch: refetchLogs } = useActivityLogs();
  const { getDays } = useLastWatered(logs);
  const { show: showToast, element: toastEl } = useToast();
  const [showWaterSheet, setShowWaterSheet] = useState(false);

  const loading = bLoading || pLoading;
  const planted = bancales.filter((b) => b.status === 'planted').length;
  const available = bancales.filter((b) => b.status === 'available' || b.status === 'empty' || b.status === 'post_chickens').length;
  const chickens = bancales.filter((b) => b.status === 'chickens' || b.status === 'waiting_chickens' || b.status === 'fallow').length;
  const activePlantings = plantings.filter((p) => p.status === 'active');
  const producing = activePlantings.filter((p) => p.stage === 2).length;
  const germinating = activePlantings.filter((p) => (p.stage ?? 0) === 0).length;

  const plantedBancales = bancales
    .filter((b) => b.status === 'planted')
    .map((b) => {
      const days = getDays(b.id);
      const crops = activePlantings.filter((p) => p.bancal_id === b.id).map((p) => p.crop_name).join(', ');
      return { ...b, waterDays: days, crops };
    })
    .sort((a, b) => (b.waterDays ?? 999) - (a.waterDays ?? 999));

  const handleQuickWater = async (bancalId: string, bancalName: string) => {
    const who = profile?.display_name ?? '';
    await addLog({
      bancal_id: bancalId,
      action: 'watered',
      notes: `Riego rápido${who ? ` · ${who}` : ''}`,
    });
    setShowWaterSheet(false);
    refetchLogs();
    showToast(`💧 Riego registrado en ${bancalName}`, 'info');
  };

  return (
    <div className="flex flex-col h-full">
      {toastEl}

      {bError && (
        <div className="px-4 py-2 text-xs" style={{ background: 'var(--orange-900)', color: 'var(--orange-200)' }}>
          Sin conexión — datos locales
        </div>
      )}

      {/* Stats bar */}
      <div className="flex gap-1.5 px-4 py-2 shrink-0 overflow-x-auto">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
          style={{ background: 'var(--green-900)', color: 'var(--green-200)' }}>
          {planted} plantados
        </span>
        {producing > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{ background: 'var(--green-800)', color: 'var(--green-400)' }}>
            🍅 {producing} produciendo
          </span>
        )}
        {germinating > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{ background: 'var(--earth-800)', color: 'var(--earth-200)' }}>
            🫘 {germinating} germinando
          </span>
        )}
        <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
          style={{ background: 'var(--earth-800)', color: 'var(--earth-200)' }}>
          ✅ {available} libres
        </span>
        {chickens > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{ background: 'var(--orange-900)', color: 'var(--orange-200)' }}>
            🐔 {chickens}
          </span>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 overflow-auto px-1 pb-1 flex items-center justify-center" style={{ touchAction: 'pan-x pan-y pinch-zoom' }}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--green-400)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <HuertaMapSVG bancales={bancales} />
        )}
      </div>

      {/* FAB watering */}
      <button
        onClick={() => setShowWaterSheet(true)}
        className="fixed z-40 rounded-full flex items-center justify-center border-none cursor-pointer shadow-lg"
        style={{
          width: 56, height: 56,
          right: 16, bottom: 80,
          background: 'var(--water)',
          color: 'white',
          fontSize: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        💧
      </button>

      {/* Water bottom sheet */}
      {showWaterSheet && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowWaterSheet(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
          <div
            className="relative w-full max-w-md mx-auto rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
            style={{ background: 'var(--earth-800)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base m-0 mb-3" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}>
              💧 Riego rápido
            </h3>
            <div className="flex flex-col gap-2">
              {plantedBancales.map((b) => (
                <button key={b.id}
                  onClick={() => handleQuickWater(b.id, b.name)}
                  className="flex items-center justify-between rounded-lg p-3 cursor-pointer border-none text-left w-full"
                  style={{ background: 'var(--earth-900)' }}
                >
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--earth-50)' }}>{b.name}</span>
                    {b.crops && <span className="text-xs ml-2" style={{ color: 'var(--earth-400)' }}>{b.crops}</span>}
                  </div>
                  {b.waterDays !== null && (
                    <span className="text-xs shrink-0" style={{
                      color: b.waterDays > 5 ? 'var(--orange-400)' : 'var(--water)',
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}>
                      💧 {b.waterDays === 0 ? 'hoy' : `${b.waterDays}d`}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
