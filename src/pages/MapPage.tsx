import { HuertaMap } from '../components/map/HuertaMap';
import { useBancales } from '../hooks/useBancales';
import { usePlantings } from '../hooks/usePlantings';

export function MapPage() {
  const { bancales, loading: bLoading, error: bError } = useBancales();
  const { plantings, loading: pLoading } = usePlantings();

  const loading = bLoading || pLoading;
  const planted = bancales.filter((b) => b.status === 'planted').length;
  const empty = bancales.filter((b) => b.status === 'empty').length;
  const fallow = bancales.filter((b) => b.status === 'fallow').length;

  return (
    <div className="flex flex-col h-full">
      {/* Error banner */}
      {bError && (
        <div className="px-4 py-2 text-xs" style={{ background: 'var(--orange-900)', color: 'var(--orange-200)' }}>
          Sin conexión — datos locales
        </div>
      )}

      {/* Summary bar */}
      <div className="flex gap-2 px-4 py-2 shrink-0 flex-wrap">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'var(--green-900)', color: 'var(--green-200)' }}>
          {planted} plantados
        </span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'var(--earth-800)', color: 'var(--earth-200)' }}>
          {empty} libres
        </span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'var(--orange-900)', color: 'var(--orange-200)' }}>
          {fallow} en barbecho
        </span>
      </div>

      {/* Map */}
      <div className="flex-1 overflow-auto px-2 pb-2">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--green-400)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <HuertaMap bancales={bancales} plantings={plantings} />
        )}
      </div>
    </div>
  );
}
