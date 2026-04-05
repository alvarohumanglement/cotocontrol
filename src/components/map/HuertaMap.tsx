import { useNavigate } from 'react-router-dom';
import type { Bancal, Planting } from '../../lib/types';
import { BancalShape } from './BancalShape';

interface HuertaMapProps {
  bancales: Bancal[];
  plantings: Planting[];
  waterMap?: { getLabel: (id: string) => string | null; getDays: (id: string) => number | null };
}

export function HuertaMap({ bancales, plantings, waterMap }: HuertaMapProps) {
  const navigate = useNavigate();

  const handleClick = (id: string) => navigate(`/bancal/${id}`);

  const inv = bancales.find((b) => b.id === 'INV');
  const pat = bancales.find((b) => b.id === 'PAT');

  return (
    <svg
      viewBox="0 0 750 720"
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', maxHeight: 'calc(100dvh - 160px)' }}
      role="img"
      aria-label="Mapa de CotoControl"
    >
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(232,213,183,0.03)" strokeWidth={0.5} />
        </pattern>
        <style>{`
          .bancal-g { outline: none; }
          .bancal-g .bancal-rect { transition: all 0.25s ease; }

          .bancal-g[data-status="planted"] .bancal-rect { fill: var(--green-800); stroke: var(--green-600); }
          .bancal-g[data-status="planted"]:hover .bancal-rect,
          .bancal-g[data-status="planted"]:focus .bancal-rect { fill: var(--green-600); stroke: var(--green-400); }

          .bancal-g[data-status="empty"] .bancal-rect,
          .bancal-g[data-status="available"] .bancal-rect { fill: var(--earth-800); stroke: var(--earth-600); }
          .bancal-g[data-status="empty"]:hover .bancal-rect,
          .bancal-g[data-status="available"]:hover .bancal-rect { fill: var(--earth-600); stroke: var(--earth-400); }

          .bancal-g[data-status="fallow"] .bancal-rect,
          .bancal-g[data-status="chickens"] .bancal-rect { fill: var(--orange-400); stroke: var(--orange-600); }
          .bancal-g[data-status="fallow"]:hover .bancal-rect,
          .bancal-g[data-status="chickens"]:hover .bancal-rect { fill: var(--orange-200); stroke: var(--orange-400); }

          .bancal-g[data-status="waiting_chickens"] .bancal-rect { fill: var(--orange-800); stroke: var(--orange-600); }
          .bancal-g[data-status="waiting_chickens"]:hover .bancal-rect { fill: var(--orange-600); stroke: var(--orange-400); }

          .bancal-g[data-status="post_chickens"] .bancal-rect { fill: var(--green-900); stroke: var(--green-600); }
          .bancal-g[data-status="post_chickens"]:hover .bancal-rect { fill: var(--green-800); stroke: var(--green-400); }

          .bancal-g[data-status="resting"] .bancal-rect { fill: var(--earth-800); stroke: var(--earth-600); }
          .bancal-g[data-status="resting"]:hover .bancal-rect { fill: var(--earth-600); stroke: var(--earth-400); }

          .zone-g { outline: none; }
          .zone-g rect { transition: all 0.25s ease; }
          .zone-g:hover rect, .zone-g:focus rect { filter: brightness(1.3); }
        `}</style>
      </defs>

      <rect width="750" height="720" fill="url(#grid)" />

      {/* ── PATATAL — top center ── */}
      {pat && (
        <g className="zone-g"
          onClick={() => handleClick('PAT')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleClick('PAT'); }}
          role="button" tabIndex={0} cursor="pointer">
          <text x={310} y={40} textAnchor="middle"
            fill="var(--earth-50)" opacity={0.5} fontSize={14}
            fontFamily="'DM Serif Display', serif"
            style={{ pointerEvents: 'none' }}>PATATAL</text>
          <rect x={180} y={50} width={260} height={90} rx={6}
            fill="var(--orange-400)" fillOpacity={0.2}
            stroke="var(--orange-600)" strokeWidth={1.5} strokeDasharray="6 4" />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={190} y1={65 + i * 16} x2={430} y2={65 + i * 16}
              stroke="var(--orange-600)" strokeWidth={0.8} strokeDasharray="4 6" opacity={0.4}
              style={{ pointerEvents: 'none' }} />
          ))}
          <text x={310} y={152} textAnchor="middle"
            fill="var(--earth-400)" fontSize={10}
            fontFamily="'IBM Plex Mono', monospace"
            style={{ pointerEvents: 'none' }}>
            15m × 5m · {pat.irrigation_lines} líneas riego
          </text>
        </g>
      )}

      {/* ── INVERNADERO — top right ── */}
      {inv && (
        <g className="zone-g"
          onClick={() => handleClick('INV')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleClick('INV'); }}
          role="button" tabIndex={0} cursor="pointer">
          <text x={600} y={75} textAnchor="middle"
            fill="var(--earth-50)" opacity={0.5} fontSize={14}
            fontFamily="'DM Serif Display', serif"
            style={{ pointerEvents: 'none' }}>INVERNADERO</text>
          <rect x={500} y={85} width={200} height={130} rx={6}
            fill="var(--purple-400)" fillOpacity={0.15}
            stroke="var(--purple-600)" strokeWidth={1.5} strokeDasharray="6 4" />
          {[0, 1, 2, 3, 4].map((i) => {
            const lineY = 100 + i * 22;
            return (
              <g key={i} style={{ pointerEvents: 'none' }}>
                <line x1={510} y1={lineY} x2={690} y2={lineY}
                  stroke="var(--water)" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
                {Array.from({ length: 5 }, (_, j) => (
                  <circle key={j} cx={525 + j * 38} cy={lineY} r={1.5}
                    fill="var(--water)" opacity={0.6} />
                ))}
              </g>
            );
          })}
          <text x={600} y={228} textAnchor="middle"
            fill="var(--earth-400)" fontSize={10}
            fontFamily="'IBM Plex Mono', monospace"
            style={{ pointerEvents: 'none' }}>
            8m × 3m · {inv.irrigation_lines} líneas · goteo {inv.irrigation_spacing_cm}cm
          </text>
        </g>
      )}

      {/* ── CIRCLE GUIDE B1-B9 ── */}
      <circle cx={310} cy={430} r={120}
        fill="none" stroke="var(--earth-800)" strokeWidth={0.5}
        strokeDasharray="4 8" opacity={0.3} />
      <circle cx={310} cy={430} r={15}
        fill="var(--earth-800)" fillOpacity={0.3}
        stroke="var(--earth-600)" strokeWidth={0.5} />

      {/* ── ALL BANCALES ── */}
      {bancales.map((b) => (
        <BancalShape key={b.id} bancal={b}
          plantings={plantings.filter((p) => p.bancal_id === b.id && p.status === 'active')}
          onClick={handleClick} />
      ))}

      {/* ── WATERING INDICATORS ── */}
      {waterMap && bancales.filter((b) => /^B[1-9]$/.test(b.id)).map((b) => {
        const wl = waterMap.getLabel(b.id);
        if (!wl) return null;
        const days = waterMap.getDays(b.id) ?? 0;
        return (
          <text key={`w-${b.id}`} x={b.position_x} y={b.position_y + 20}
            textAnchor="middle" fontSize={9}
            fontFamily="'IBM Plex Mono', monospace"
            fill={days > 5 ? 'var(--orange-400)' : 'var(--water)'}
            opacity={0.8} style={{ pointerEvents: 'none' }}>
            💧 {wl}
          </text>
        );
      })}

      {/* ── DIMENSION LABELS ── */}
      <text x={56} y={290} textAnchor="middle"
        fill="var(--earth-400)" fontSize={9}
        fontFamily="'IBM Plex Mono', monospace"
        style={{ pointerEvents: 'none' }}>5m × 1.2m</text>

      <text x={210} y={685} textAnchor="middle"
        fill="var(--earth-400)" fontSize={9}
        fontFamily="'IBM Plex Mono', monospace"
        style={{ pointerEvents: 'none' }}>10m × 1.2m · 2 líneas riego</text>

      <text x={640} y={370} textAnchor="middle"
        fill="var(--earth-400)" fontSize={9}
        fontFamily="'IBM Plex Mono', monospace"
        style={{ pointerEvents: 'none' }}>10m × 1.2m</text>
    </svg>
  );
}
