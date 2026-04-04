import type { Bancal, Planting } from '../../lib/types';

interface BancalShapeProps {
  bancal: Bancal;
  plantings: Planting[];
  onClick: (id: string) => void;
}

export function BancalShape({ bancal, plantings, onClick }: BancalShapeProps) {
  const { id, type, status } = bancal;
  const hasPlantings = plantings.length > 0;

  // Special zones handled separately in HuertaMap
  if (type === 'greenhouse' || type === 'patatal') return null;

  const isLarge = type === 'large';
  const isVertical = id === 'B10' || id === 'B11';
  const isCircle = !isLarge && !isVertical;

  // Determine position and size
  let w: number, h: number, gx: number, gy: number;
  if (isVertical) {
    w = 22; h = 90;
    gx = id === 'B10' ? 55 : 87;
    gy = 155;
  } else if (isLarge) {
    w = 200; h = 22;
    if (id === 'B12')      { gx = 610; gy = 600; }
    else if (id === 'B13') { gx = 610; gy = 632; }
    else if (id === 'B14') { gx = 690; gy = 320; }
    else                   { gx = 690; gy = 352; }
  } else {
    w = 90; h = 20;
    gx = bancal.position_x;
    gy = bancal.position_y;
  }

  const transform = isCircle
    ? `translate(${gx}, ${gy}) rotate(${bancal.rotation})`
    : `translate(${gx}, ${gy})`;

  const rx = isCircle ? -w / 2 : 0;
  const ry = isCircle ? -h / 2 : 0;
  const fillOpacity = status === 'fallow' ? 0.8 : 1;
  const label = id === 'B8' ? 'B8 🐔' : id;

  // Irrigation lines
  const irrigationLines = () => {
    const props = { stroke: 'var(--water)', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.5, style: { pointerEvents: 'none' as const } };
    if (isVertical) {
      return <line x1={w / 2} y1={4} x2={w / 2} y2={h - 4} {...props} />;
    }
    if (isLarge) {
      return (
        <>
          <line x1={4} y1={8} x2={w - 4} y2={8} {...props} />
          <line x1={4} y1={15} x2={w - 4} y2={15} {...props} />
        </>
      );
    }
    return <line x1={rx + 4} y1={0} x2={rx + w - 4} y2={0} {...props} />;
  };

  // Label
  const lx = isCircle ? 0 : w / 2;
  const ly = isCircle ? 0 : h / 2;

  // Planting indicator
  const dotCx = isCircle ? w / 2 - 7 : w - 6;
  const dotCy = isCircle ? -h / 2 + 3 : 6;

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
      {irrigationLines()}
      <text
        x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
        fill="var(--earth-50)" fontSize={11}
        fontFamily="'IBM Plex Mono', monospace" fontWeight={500}
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
      {hasPlantings && status === 'planted' && (
        <circle cx={dotCx} cy={dotCy} r={3} fill="var(--green-200)"
          style={{ pointerEvents: 'none' }} />
      )}
    </g>
  );
}
