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

  const isLarge = type === 'large';
  const isVertical = id === 'B10' || id === 'B11' || id === 'LFR';
  const isCircle = /^B[1-9]$/.test(id);

  // Dimensions
  let w: number, h: number;
  if (id === 'LFR')       { w = 14; h = 80; }
  else if (isVertical)    { w = 22; h = 80; }
  else if (isLarge)       { w = 180; h = 22; }
  else                    { w = 80; h = 22; }

  const fillOpacity = (status === 'fallow' || status === 'chickens') ? 0.8 : 1;
  const isChickens = status === 'chickens' || status === 'waiting_chickens' || status === 'post_chickens';
  const label = isChickens ? `${id} 🐔` : id;

  const irrigProps = { stroke: 'var(--water)', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.5, style: { pointerEvents: 'none' as const } };

  const irrigationLines = () => {
    const n = bancal.irrigation_lines;
    if (isVertical) {
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

  // For circle bancales: center on position, rotate around center
  const transform = isCircle
    ? `translate(${bancal.position_x}, ${bancal.position_y}) rotate(${bancal.rotation})`
    : `translate(${bancal.position_x}, ${bancal.position_y})`;

  const rx = isCircle ? -w / 2 : 0;
  const ry = isCircle ? -h / 2 : 0;

  const circleIrrigation = () => {
    const n = bancal.irrigation_lines;
    return Array.from({ length: n }, (_, i) => {
      const ly = ry + (h / (n + 1)) * (i + 1);
      return <line key={i} x1={rx + 4} y1={ly} x2={rx + w - 4} y2={ly} {...irrigProps} />;
    });
  };

  const lx = isCircle ? 0 : w / 2;
  const ly = isCircle ? 0 : h / 2;

  return (
    <g
      transform={transform}
      onClick={() => onClick(id)}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(id); }}
      role="button"
      tabIndex={0}
      cursor="pointer"
      data-status={status}
      className="bancal-g"
    >
      <rect
        x={rx} y={ry} width={w} height={h} rx={4}
        fillOpacity={fillOpacity}
        strokeWidth={1.5}
        className="bancal-rect"
      />
      {isCircle ? circleIrrigation() : irrigationLines()}
      <text
        x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
        fill="var(--earth-50)" fontSize={id === 'LFR' ? 9 : 11}
        fontFamily="'IBM Plex Mono', monospace" fontWeight={500}
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
      {hasPlantings && status === 'planted' && (
        <circle cx={isCircle ? w / 2 - 5 : w - 6} cy={isCircle ? ry + 4 : 6} r={3} fill="var(--green-200)"
          style={{ pointerEvents: 'none' }} />
      )}
    </g>
  );
}
