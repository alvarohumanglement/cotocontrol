import { HuertaMap } from '../components/map/HuertaMap';
import { BANCALES, MOCK_PLANTINGS } from '../lib/constants';

export function MapPage() {
  const planted = BANCALES.filter((b) => b.status === 'planted').length;
  const empty = BANCALES.filter((b) => b.status === 'empty').length;
  const fallow = BANCALES.filter((b) => b.status === 'fallow').length;

  return (
    <div className="flex flex-col h-full">
      {/* Summary bar */}
      <div className="flex gap-2 px-4 py-2 shrink-0 flex-wrap">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'var(--green-900)', color: 'var(--green-200)' }}
        >
          {planted} plantados
        </span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'var(--earth-800)', color: 'var(--earth-200)' }}
        >
          {empty} libres
        </span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'var(--orange-900)', color: 'var(--orange-200)' }}
        >
          {fallow} en barbecho
        </span>
      </div>

      {/* Map container — scrollable */}
      <div className="flex-1 overflow-auto px-2 pb-2">
        <HuertaMap bancales={BANCALES} plantings={MOCK_PLANTINGS} />
      </div>
    </div>
  );
}
