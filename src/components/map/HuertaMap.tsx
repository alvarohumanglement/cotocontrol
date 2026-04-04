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

  const inv = bancales.find((b) => b.id === 'INV')!;
  const pat = bancales.find((b) => b.id === 'PAT')!;

  return (
    <svg
      viewBox="0 0 960 750"
      width="100%"
      style={{ maxWidth: '960px', display: 'block' }}
      role="img"
      aria-label="Mapa de la huerta comunitaria"
    >
      {/* SVG styles for hover */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(232,213,183,0.03)" strokeWidth={0.5} />
        </pattern>
        <style>{`
          .bancal-g { outline: none; }
          .bancal-g .bancal-rect { transition: all 0.25s ease; }

          .bancal-g[data-status="planted"] .bancal-rect { fill: var(--green-800); stroke: var(--green-600); }
          .bancal-g[data-status="planted"]:hover .bancal-rect,
          .bancal-g[data-status="planted"]:focus .bancal-rect { fill: var(--green-600); stroke: var(--green-400); }

          .bancal-g[data-status="empty"] .bancal-rect { fill: var(--earth-800); stroke: var(--earth-600); }
          .bancal-g[data-status="empty"]:hover .bancal-rect,
          .bancal-g[data-status="empty"]:focus .bancal-rect { fill: var(--earth-600); stroke: var(--earth-400); }

          .bancal-g[data-status="fallow"] .bancal-rect { fill: var(--orange-400); stroke: var(--orange-600); }
          .bancal-g[data-status="fallow"]:hover .bancal-rect,
          .bancal-g[data-status="fallow"]:focus .bancal-rect { fill: var(--orange-200); stroke: var(--orange-400); }

          .bancal-g[data-status="resting"] .bancal-rect { fill: var(--earth-800); stroke: var(--earth-600); }
          .bancal-g[data-status="resting"]:hover .bancal-rect,
          .bancal-g[data-status="resting"]:focus .bancal-rect { fill: var(--earth-600); stroke: var(--earth-400); }

          .bancal-g[data-status="available"] .bancal-rect { fill: var(--earth-800); stroke: var(--earth-600); }
          .bancal-g[data-status="available"]:hover .bancal-rect,
          .bancal-g[data-status="available"]:focus .bancal-rect { fill: var(--earth-600); stroke: var(--earth-400); }

          .bancal-g[data-status="chickens"] .bancal-rect { fill: var(--orange-400); stroke: var(--orange-600); }
          .bancal-g[data-status="chickens"]:hover .bancal-rect,
          .bancal-g[data-status="chickens"]:focus .bancal-rect { fill: var(--orange-200); stroke: var(--orange-400); }

          .bancal-g[data-status="waiting_chickens"] .bancal-rect { fill: var(--orange-800); stroke: var(--orange-600); }
          .bancal-g[data-status="waiting_chickens"]:hover .bancal-rect,
          .bancal-g[data-status="waiting_chickens"]:focus .bancal-rect { fill: var(--orange-600); stroke: var(--orange-400); }

          .bancal-g[data-status="post_chickens"] .bancal-rect { fill: var(--green-900); stroke: var(--green-600); }
          .bancal-g[data-status="post_chickens"]:hover .bancal-rect,
          .bancal-g[data-status="post_chickens"]:focus .bancal-rect { fill: var(--green-800); stroke: var(--green-400); }

          .zone-g { outline: none; }
          .zone-g rect { transition: all 0.25s ease; }
          .zone-g:hover rect, .zone-g:focus rect { filter: brightness(1.3); }
        `}</style>
      </defs>

      {/* Grid background */}
      <rect width="960" height="750" fill="url(#grid)" />

      {/* ── PATATAL ── */}
      <g
        className="zone-g"
        onClick={() => handleClick('PAT')}
        onKeyDown={(e) => { if (e.key === 'Enter') handleClick('PAT'); }}
        role="button" tabIndex={0} cursor="pointer"
      >
        <text x={310} y={25} textAnchor="middle"
          fill="var(--earth-50)" opacity={0.5} fontSize={13}
          fontFamily="'DM Serif Display', serif"
          style={{ pointerEvents: 'none' }}>
          PATATAL
        </text>
        <rect x={200} y={35} width={220} height={100} rx={6}
          fill="var(--orange-400)" fillOpacity={0.2}
          stroke="var(--orange-600)" strokeWidth={1.5} strokeDasharray="6 4" />
        {/* 5 planting rows */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i}
            x1={210} y1={50 + i * 20} x2={410} y2={50 + i * 20}
            stroke="var(--orange-600)" strokeWidth={0.8} strokeDasharray="4 6" opacity={0.4}
            style={{ pointerEvents: 'none' }} />
        ))}
        <text x={310} y={145} textAnchor="middle"
          fill="var(--earth-400)" fontSize={9}
          fontFamily="'IBM Plex Mono', monospace"
          style={{ pointerEvents: 'none' }}>
          15m × 5m · {pat.irrigation_lines} líneas riego
        </text>
      </g>

      {/* ── INVERNADERO ── */}
      <g
        className="zone-g"
        onClick={() => handleClick('INV')}
        onKeyDown={(e) => { if (e.key === 'Enter') handleClick('INV'); }}
        role="button" tabIndex={0} cursor="pointer"
      >
        <text x={790} y={70} textAnchor="middle"
          fill="var(--earth-50)" opacity={0.5} fontSize={13}
          fontFamily="'DM Serif Display', serif"
          style={{ pointerEvents: 'none' }}>
          INVERNADERO
        </text>
        <rect x={680} y={80} width={220} height={140} rx={6}
          fill="var(--purple-400)" fillOpacity={0.15}
          stroke="var(--purple-600)" strokeWidth={1.5} strokeDasharray="6 4" />
        {/* 5 irrigation lines with drip points */}
        {[0, 1, 2, 3, 4].map((i) => {
          const lineY = 100 + i * 25;
          return (
            <g key={i} style={{ pointerEvents: 'none' }}>
              <line x1={690} y1={lineY} x2={890} y2={lineY}
                stroke="var(--water)" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
              {/* Drip points */}
              {Array.from({ length: 6 }, (_, j) => (
                <circle key={j} cx={705 + j * 35} cy={lineY} r={1.5}
                  fill="var(--water)" opacity={0.6} />
              ))}
            </g>
          );
        })}
        <text x={790} y={232} textAnchor="middle"
          fill="var(--earth-400)" fontSize={9}
          fontFamily="'IBM Plex Mono', monospace"
          style={{ pointerEvents: 'none' }}>
          8m × 3m · {inv.irrigation_lines} líneas · goteo {inv.irrigation_spacing_cm}cm
        </text>
      </g>

      {/* ── CIRCLE GUIDE (centro B1-B9) ── */}
      <circle cx={370} cy={440} r={138}
        fill="none" stroke="var(--earth-800)" strokeWidth={0.5}
        strokeDasharray="4 8" opacity={0.3} />
      {/* Small central circle */}
      <circle cx={370} cy={440} r={22}
        fill="var(--earth-800)" fillOpacity={0.3}
        stroke="var(--earth-600)" strokeWidth={0.5} />

      {/* ── ALL BANCALES ── */}
      {bancales.map((b) => (
        <BancalShape
          key={b.id}
          bancal={b}
          plantings={plantings.filter((p) => p.bancal_id === b.id && p.status === 'active')}
          onClick={handleClick}
        />
      ))}

      {/* ── WATERING INDICATORS ── */}
      {waterMap && bancales.filter((b) => b.type === 'small' && b.id !== 'B10' && b.id !== 'B11').map((b) => {
        const label = waterMap.getLabel(b.id);
        if (!label) return null;
        const days = waterMap.getDays(b.id) ?? 0;
        return (
          <text key={`w-${b.id}`} x={b.position_x} y={b.position_y + 18}
            textAnchor="middle" fontSize={9}
            fontFamily="'IBM Plex Mono', monospace"
            fill={days > 5 ? 'var(--orange-400)' : 'var(--water)'}
            opacity={0.8}
            style={{ pointerEvents: 'none' }}>
            💧 {label}
          </text>
        );
      })}

      {/* ── DIMENSION LABELS ── */}
      {/* B10/B11 */}
      <text x={76} y={255} textAnchor="middle"
        fill="var(--earth-400)" fontSize={9}
        fontFamily="'IBM Plex Mono', monospace"
        style={{ pointerEvents: 'none' }}>
        5m × 1.2m
      </text>

      {/* B12/B13 */}
      <text x={710} y={665} textAnchor="middle"
        fill="var(--earth-400)" fontSize={9}
        fontFamily="'IBM Plex Mono', monospace"
        style={{ pointerEvents: 'none' }}>
        10m × 1.2m · 2 líneas riego
      </text>

      {/* B14/B15 */}
      <text x={790} y={385} textAnchor="middle"
        fill="var(--earth-400)" fontSize={9}
        fontFamily="'IBM Plex Mono', monospace"
        style={{ pointerEvents: 'none' }}>
        10m × 1.2m · 2 líneas riego
      </text>
    </svg>
  );
}
