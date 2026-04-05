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
      viewBox="0 -60 390 560"
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', maxHeight: 'calc(100dvh - 160px)' }}
      role="img"
      aria-label="Mapa de CotoControl"
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(232,213,183,0.03)" strokeWidth={0.5} />
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

      <rect x="0" y="-60" width="390" height="560" fill="url(#grid)" />

      {/* ── PATATAL ── */}
      {pat && (
        <g className="zone-g"
          onClick={() => handleClick('PAT')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleClick('PAT'); }}
          role="button" tabIndex={0} cursor="pointer">
          <text x={130} y={10} textAnchor="middle"
            fill="var(--earth-50)" opacity={0.5} fontSize={13}
            fontFamily="'DM Serif Display', serif"
            style={{ pointerEvents: 'none' }}>PATATAL</text>
          <rect x={45} y={16} width={170} height={60} rx={6}
            fill="var(--orange-400)" fillOpacity={0.2}
            stroke="var(--orange-600)" strokeWidth={1.5} strokeDasharray="6 4" />
          {[26, 34, 42, 50, 58].map((y) => (
            <line key={y} x1={55} y1={y} x2={205} y2={y}
              stroke="var(--orange-600)" strokeWidth={0.8} strokeDasharray="4 6" opacity={0.4}
              style={{ pointerEvents: 'none' }} />
          ))}
          <text x={130} y={86} textAnchor="middle"
            fill="var(--earth-400)" fontSize={9}
            fontFamily="'IBM Plex Mono', monospace"
            style={{ pointerEvents: 'none' }}>
            15m × 5m · {pat.irrigation_lines} líneas riego
          </text>
        </g>
      )}

      {/* ── INVERNADERO ── */}
      {inv && (
        <g className="zone-g"
          onClick={() => handleClick('INV')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleClick('INV'); }}
          role="button" tabIndex={0} cursor="pointer">
          <text x={272} y={88} textAnchor="middle"
            fill="var(--earth-50)" opacity={0.5} fontSize={13}
            fontFamily="'DM Serif Display', serif"
            style={{ pointerEvents: 'none' }}>INVERNADERO</text>
          <rect x={225} y={95} width={105} height={70} rx={6}
            fill="var(--purple-400)" fillOpacity={0.15}
            stroke="var(--purple-600)" strokeWidth={1.5} strokeDasharray="6 4" />
          {[107, 117, 127, 137, 147].map((y) => (
            <g key={y} style={{ pointerEvents: 'none' }}>
              <line x1={232} y1={y} x2={323} y2={y}
                stroke="var(--water)" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.5} />
            </g>
          ))}
          {/* Drip points on center line */}
          {[244, 256, 268, 280, 292, 304, 316].map((cx) => (
            <circle key={cx} cx={cx} cy={127} r={1} fill="var(--water)" opacity={0.3}
              style={{ pointerEvents: 'none' }} />
          ))}
          <text x={272} y={177} textAnchor="middle"
            fill="var(--earth-400)" fontSize={9}
            fontFamily="'IBM Plex Mono', monospace"
            style={{ pointerEvents: 'none' }}>
            8m × 3m · {inv.irrigation_lines} líneas · goteo {inv.irrigation_spacing_cm}cm
          </text>
        </g>
      )}

      {/* ── CIRCLE GUIDE (centro B1-B9) ── */}
      <circle cx={155} cy={290} r={95}
        fill="none" stroke="var(--earth-800)" strokeWidth={0.5}
        strokeDasharray="4 8" opacity={0.3} />
      <circle cx={155} cy={290} r={7}
        fill="var(--earth-800)" fillOpacity={0.3}
        stroke="var(--earth-600)" strokeWidth={0.5} />

      {/* ── ALL BANCALES ── */}
      {bancales.map((b) => (
        <BancalShape key={b.id} bancal={b}
          plantings={plantings.filter((p) => p.bancal_id === b.id && p.status === 'active')}
          onClick={handleClick} />
      ))}

      {/* ── DIMENSION LABELS ── */}
      <text x={33} y={193} textAnchor="middle"
        fill="var(--earth-400)" fontSize={9}
        fontFamily="'IBM Plex Mono', monospace"
        style={{ pointerEvents: 'none' }}>5m × 1.2m</text>

      <text x={354} y={448} textAnchor="middle"
        fill="var(--earth-400)" fontSize={9}
        fontFamily="'IBM Plex Mono', monospace"
        style={{ pointerEvents: 'none' }}>10m × 1.2m</text>

      <text x={173} y={470} textAnchor="middle"
        fill="var(--earth-400)" fontSize={9}
        fontFamily="'IBM Plex Mono', monospace"
        style={{ pointerEvents: 'none' }}>10m × 1.2m · 2 líneas riego</text>

      {/* ── STATUS INDICATORS for B14/B15 ── */}
      {bancales.find((b) => b.id === 'B15')?.status === 'planted' && (
        <circle cx={354} cy={208} r={3} fill="var(--green-200)" opacity={0.6}
          style={{ pointerEvents: 'none' }} />
      )}
      {bancales.find((b) => b.id === 'B14')?.status === 'planted' && (
        <circle cx={354} cy={324} r={3} fill="var(--green-200)" opacity={0.6}
          style={{ pointerEvents: 'none' }} />
      )}

      {/* ── WATERING INDICATORS (for circle bancales) ── */}
      {waterMap && bancales.filter((b) => /^B[1-9]$/.test(b.id)).map((b) => {
        const wl = waterMap.getLabel(b.id);
        if (!wl) return null;
        const days = waterMap.getDays(b.id) ?? 0;
        // Calculate label position outside the circle
        const rad = (b.rotation - 90) * Math.PI / 180;
        const lx = 155 + Math.cos(rad) * 108;
        const ly = 290 + Math.sin(rad) * 108;
        return (
          <text key={`w-${b.id}`} x={lx} y={ly}
            textAnchor="middle" fontSize={8}
            fontFamily="'IBM Plex Mono', monospace"
            fill={days > 5 ? 'var(--orange-400)' : 'var(--water)'}
            opacity={0.7} style={{ pointerEvents: 'none' }}>
            💧{wl}
          </text>
        );
      })}
    </svg>
  );
}
