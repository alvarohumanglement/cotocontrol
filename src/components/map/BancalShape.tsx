import type { Bancal, Planting } from '../../lib/types';

interface BancalShapeProps {
  bancal: Bancal;
  plantings: Planting[];
  onClick: (id: string) => void;
}

export function BancalShape({ bancal, plantings, onClick }: BancalShapeProps) {
  const { id, type, status } = bancal;
  const hasPlantings = plantings.length > 0;

  if (type === 'greenhouse' || type === 'patatal') return null;

  const isCircle = /^B[1-9]$/.test(id);
  const isChickens = status === 'chickens' || status === 'waiting_chickens' || status === 'post_chickens';
  const label = isChickens ? `${id} 🐔` : id;
  const fillOpacity = (status === 'fallow' || status === 'chickens') ? 0.8 : 1;

  const common = {
    onClick: () => onClick(id),
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') onClick(id); },
    role: 'button' as const,
    tabIndex: 0,
    cursor: 'pointer',
    'data-status': status,
    className: 'bancal-g',
  };

  const irrigProps = { stroke: 'var(--water)', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.5, style: { pointerEvents: 'none' as const } };

  // ── Circle bancales B1-B9: clock-hand from center (155, 290) ──
  if (isCircle) {
    const angle = bancal.rotation;
    return (
      <g transform="translate(155,290)" {...common}>
        <g transform={`rotate(${angle})`}>
          <rect x={-9} y={-95} width={18} height={65} rx={4}
            fillOpacity={fillOpacity} strokeWidth={1.5} className="bancal-rect" />
          <line x1={0} y1={-91} x2={0} y2={-34} {...irrigProps} />
          <text x={0} y={-58} textAnchor="middle" dominantBaseline="central"
            fill="var(--earth-50)" fontSize={11}
            fontFamily="'IBM Plex Mono', monospace" fontWeight={500}
            transform={`rotate(${-angle})`}
            style={{ pointerEvents: 'none' }}>
            {label}
          </text>
          {hasPlantings && status === 'planted' && (
            <circle cx={0} cy={-96} r={3} fill="var(--green-200)"
              style={{ pointerEvents: 'none' }} />
          )}
        </g>
      </g>
    );
  }

  // ── Non-circle bancales: exact positions from spec ──
  let w: number, h: number;
  const isVertical = id === 'B10' || id === 'B11' || id === 'LFR';
  const isTower = id === 'B14' || id === 'B15';

  if (id === 'B10' || id === 'B11') { w = 18; h = 72; }
  else if (id === 'LFR')            { w = 14; h = 70; }
  else if (isTower)                  { w = 18; h = 110; }
  else if (id === 'B12' || id === 'B13') { w = 120; h = 18; }
  else                               { w = 18; h = 65; }

  const gx = bancal.position_x;
  const gy = bancal.position_y;

  const irrigationLines = () => {
    const n = bancal.irrigation_lines;
    if (isVertical || isTower) {
      return Array.from({ length: n }, (_, i) => {
        const lx = (w / (n + 1)) * (i + 1);
        return <line key={i} x1={lx} y1={4} x2={lx} y2={h - 4} {...irrigProps} />;
      });
    }
    return Array.from({ length: n }, (_, i) => {
      const ly = (h / (n + 1)) * (i + 1);
      return <line key={i} x1={4} y1={ly} x2={w - 4} y2={ly} {...irrigProps} />;
    });
  };

  const isTall = isVertical || isTower;

  return (
    <g transform={`translate(${gx},${gy})`} {...common}>
      <rect x={0} y={0} width={w} height={h} rx={4}
        fillOpacity={fillOpacity} strokeWidth={1.5} className="bancal-rect" />
      {irrigationLines()}
      <text x={w / 2} y={h / 2} textAnchor="middle" dominantBaseline="central"
        fill="var(--earth-50)" fontSize={id === 'LFR' ? 9 : 11}
        fontFamily="'IBM Plex Mono', monospace" fontWeight={500}
        style={{ pointerEvents: 'none' }}
        {...(isTall ? { transform: `rotate(-90, ${w / 2}, ${h / 2})` } : {})}
      >
        {label}
      </text>
      {hasPlantings && status === 'planted' && (
        <circle cx={w - 6} cy={6} r={3} fill="var(--green-200)"
          style={{ pointerEvents: 'none' }} />
      )}
    </g>
  );
}
