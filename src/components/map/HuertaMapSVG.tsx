import React from 'react';
import { useNavigate } from 'react-router-dom';

const CIRCLE_CENTER = { x: 155, y: 290 };

const CIRCLE_BANCALES = [
  { id: 'B1', angle: 162 },
  { id: 'B2', angle: 193 },
  { id: 'B3', angle: 223 },
  { id: 'B4', angle: 254 },
  { id: 'B5', angle: 284 },
  { id: 'B6', angle: 315 },
  { id: 'B7', angle: 345 },
  { id: 'B8', angle: 16 },
  { id: 'B9', angle: 47 },
];

// 5 consolidated states with colors
const STATUS_COLORS: Record<string, { fill: string; stroke: string }> = {
  planted:          { fill: '#2d5a27', stroke: '#4a9e3c' },
  waiting_chickens: { fill: '#8a6a20', stroke: '#d4a030' },
  chickens:         { fill: '#8a4a10', stroke: '#d4802a' },
  post_chickens:    { fill: '#5a4020', stroke: '#8a7040' },
  available:        { fill: '#3d3425', stroke: '#6b5d42' },
  // Fallbacks for legacy states
  empty:            { fill: '#3d3425', stroke: '#6b5d42' },
  fallow:           { fill: '#8a4a10', stroke: '#d4802a' },
  resting:          { fill: '#3d3425', stroke: '#6b5d42' },
};

const LEGEND = [
  { status: 'planted',          label: 'Plantado',     fill: '#2d5a27', stroke: '#4a9e3c' },
  { status: 'waiting_chickens', label: 'Esp. gallinas', fill: '#8a6a20', stroke: '#d4a030' },
  { status: 'chickens',         label: 'Gallinas',     fill: '#8a4a10', stroke: '#d4802a' },
  { status: 'post_chickens',    label: 'Para preparar', fill: '#5a4020', stroke: '#8a7040' },
  { status: 'available',        label: 'Disponible',   fill: '#3d3425', stroke: '#6b5d42' },
];

interface HuertaMapSVGProps {
  bancales: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  onBancalClick?: (id: string) => void;
}

export default function HuertaMapSVG({ bancales, onBancalClick }: HuertaMapSVGProps) {
  const navigate = useNavigate();

  const getColors = (id: string) => {
    const b = bancales.find(b => b.id === id);
    return STATUS_COLORS[b?.status ?? 'available'] ?? STATUS_COLORS.available;
  };

  const handleClick = (id: string) => {
    if (onBancalClick) onBancalClick(id);
    else navigate(`/bancal/${id}`);
  };

  return (
    <svg
      viewBox="0 -60 390 560"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: 'auto', maxHeight: 'calc(100vh - 160px)' }}
    >
      {/* ===== PATATAL ===== */}
      <g onClick={() => handleClick('PAT')} style={{ cursor: 'pointer' }}>
        <text x={130} y={10} textAnchor="middle" fontSize={7} fill="#8a7a5a" letterSpacing={1} style={{ textTransform: 'uppercase' } as React.CSSProperties} fontFamily="'IBM Plex Mono', monospace">Patatal</text>
        <rect x={45} y={16} width={170} height={60} rx={3} fill="rgba(212,128,42,0.15)" stroke="#d4802a" strokeWidth={1.5} strokeDasharray="6 3" />
        {[26, 34, 42, 50, 58].map(y => (
          <line key={y} x1={55} y1={y} x2={205} y2={y} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
        ))}
        <text x={130} y={86} textAnchor="middle" fontSize={6} fill="#6b5d42" fontFamily="'IBM Plex Mono', monospace">15m × 5m · 5 líneas riego</text>
      </g>

      {/* ===== B10 ===== */}
      {(() => { const c = getColors('B10'); return (
        <g onClick={() => handleClick('B10')} style={{ cursor: 'pointer' }}>
          <rect x={12} y={110} width={18} height={72} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
          <line x1={21} y1={115} x2={21} y2={177} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <text x={21} y={150} textAnchor="middle" fontSize={9} fill="#ddd4c0" fontFamily="'IBM Plex Mono', monospace">B10</text>
        </g>
      ); })()}

      {/* ===== B11 ===== */}
      {(() => { const c = getColors('B11'); return (
        <g onClick={() => handleClick('B11')} style={{ cursor: 'pointer' }}>
          <rect x={36} y={110} width={18} height={72} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
          <line x1={45} y1={115} x2={45} y2={177} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <text x={45} y={150} textAnchor="middle" fontSize={9} fill="#ddd4c0" fontFamily="'IBM Plex Mono', monospace">B11</text>
        </g>
      ); })()}
      <text x={33} y={193} textAnchor="middle" fontSize={6} fill="#6b5d42" fontFamily="'IBM Plex Mono', monospace">5m × 1.2m</text>

      {/* ===== INVERNADERO ===== */}
      <g onClick={() => handleClick('INV')} style={{ cursor: 'pointer' }}>
        <text x={272} y={88} textAnchor="middle" fontSize={7} fill="#8a7a5a" letterSpacing={1} style={{ textTransform: 'uppercase' } as React.CSSProperties} fontFamily="'IBM Plex Mono', monospace">Invernadero</text>
        <rect x={225} y={95} width={105} height={70} rx={3} fill="rgba(122,92,192,0.15)" stroke="#7a5cc0" strokeWidth={1.5} strokeDasharray="4 2" />
        {[107, 117, 127, 137, 147].map(y => (
          <line key={y} x1={232} y1={y} x2={323} y2={y} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
        ))}
        <g opacity={0.3}>
          {[244, 256, 268, 280, 292, 304, 316].map(cx => (
            <circle key={cx} cx={cx} cy={127} r={1} fill="#4AA3CC" />
          ))}
        </g>
        <text x={272} y={177} textAnchor="middle" fontSize={6} fill="#6b5d42" fontFamily="'IBM Plex Mono', monospace">8m × 3m · 5 líneas · goteo 30cm</text>
      </g>

      {/* ===== LFR ===== */}
      {(() => { const c = getColors('LFR'); return (
        <g onClick={() => handleClick('LFR')} style={{ cursor: 'pointer' }}>
          <rect x={338} y={95} width={14} height={70} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
          <line x1={345} y1={101} x2={345} y2={159} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <text x={345} y={133} textAnchor="middle" fontSize={9} fill="#ddd4c0" fontFamily="'IBM Plex Mono', monospace">LFR</text>
        </g>
      ); })()}

      {/* ===== CENTRO DEL CÍRCULO ===== */}
      <circle cx={155} cy={290} r={7} fill="#3d3425" stroke="#6b5d42" strokeWidth={1} opacity={0.5} />

      {/* ===== B1-B9 RADIALES ===== */}
      {CIRCLE_BANCALES.map(({ id, angle }) => {
        const c = getColors(id);
        return (
          <g key={id} onClick={() => handleClick(id)} style={{ cursor: 'pointer' }}
             transform={`translate(${CIRCLE_CENTER.x},${CIRCLE_CENTER.y})`}>
            <g transform={`rotate(${angle})`}>
              <rect x={-9} y={-95} width={18} height={65} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} pointerEvents="all" />
              <line x1={0} y1={-91} x2={0} y2={-34} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
              <text x={0} y={-58} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="#ddd4c0" fontFamily="'IBM Plex Mono', monospace" fontWeight={500}
                    transform={`rotate(${-angle})`}>{id}</text>
            </g>
          </g>
        );
      })}

      {/* ===== B15 ===== */}
      {(() => { const c = getColors('B15'); return (
        <g onClick={() => handleClick('B15')} style={{ cursor: 'pointer' }}>
          <rect x={345} y={210} width={18} height={110} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
          <line x1={350} y1={216} x2={350} y2={314} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <line x1={358} y1={216} x2={358} y2={314} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <text x={354} y={270} textAnchor="middle" fontSize={9} fill="#ddd4c0" fontFamily="'IBM Plex Mono', monospace">B15</text>
        </g>
      ); })()}

      {/* ===== B14 ===== */}
      {(() => { const c = getColors('B14'); return (
        <g onClick={() => handleClick('B14')} style={{ cursor: 'pointer' }}>
          <rect x={345} y={326} width={18} height={110} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
          <line x1={350} y1={332} x2={350} y2={430} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <line x1={358} y1={332} x2={358} y2={430} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <text x={354} y={386} textAnchor="middle" fontSize={9} fill="#ddd4c0" fontFamily="'IBM Plex Mono', monospace">B14</text>
        </g>
      ); })()}
      <text x={354} y={448} textAnchor="middle" fontSize={6} fill="#6b5d42" fontFamily="'IBM Plex Mono', monospace">10m × 1.2m</text>

      {/* ===== B12 ===== */}
      {(() => { const c = getColors('B12'); return (
        <g onClick={() => handleClick('B12')} style={{ cursor: 'pointer' }}>
          <rect x={50} y={440} width={120} height={18} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
          <line x1={56} y1={445} x2={164} y2={445} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <line x1={56} y1={453} x2={164} y2={453} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <text x={110} y={454} textAnchor="middle" fontSize={9} fill="#ddd4c0" fontFamily="'IBM Plex Mono', monospace">B12</text>
        </g>
      ); })()}

      {/* ===== B13 ===== */}
      {(() => { const c = getColors('B13'); return (
        <g onClick={() => handleClick('B13')} style={{ cursor: 'pointer' }}>
          <rect x={176} y={440} width={120} height={18} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} />
          <line x1={182} y1={445} x2={290} y2={445} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <line x1={182} y1={453} x2={290} y2={453} stroke="#4AA3CC" strokeWidth={0.5} opacity={0.3} />
          <text x={236} y={454} textAnchor="middle" fontSize={9} fill="#ddd4c0" fontFamily="'IBM Plex Mono', monospace">B13</text>
        </g>
      ); })()}
      <text x={173} y={470} textAnchor="middle" fontSize={6} fill="#6b5d42" fontFamily="'IBM Plex Mono', monospace">10m × 1.2m · 2 líneas riego</text>

      {/* ===== LEYENDA ===== */}
      {LEGEND.map((item, i) => {
        const lx = 30 + i * 72;
        return (
          <g key={item.status}>
            <circle cx={lx} cy={415} r={4} fill={item.fill} stroke={item.stroke} strokeWidth={1} />
            <text x={lx + 8} y={415} dominantBaseline="central" fontSize={5.5} fill="#8a7a5a" fontFamily="'IBM Plex Mono', monospace">{item.label}</text>
          </g>
        );
      })}

      {/* QX0T mark */}
      <text x={370} y={495} textAnchor="end" fontSize={4} fill="#5C5346" opacity={0.3}
        fontFamily="'IBM Plex Mono', monospace" style={{ pointerEvents: 'none' }}>QX0T</text>

      {/* Textura sutil */}
      <defs>
        <pattern id="dots" x={0} y={0} width={20} height={20} patternUnits="userSpaceOnUse">
          <circle cx={10} cy={10} r={0.5} fill="#f0ebe0" />
        </pattern>
      </defs>
      <rect x={0} y={-60} width={390} height={560} fill="url(#dots)" opacity={0.05} style={{ pointerEvents: 'none' }} />
    </svg>
  );
}
