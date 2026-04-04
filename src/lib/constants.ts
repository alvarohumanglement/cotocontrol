import type { ActionType, Bancal } from './types'

export const BANCALES_SEED: Omit<Bancal, 'status'>[] = [
  // Círculo B1-B9 (5m × 1.2m, 1 línea riego)
  { id: 'B1',  name: 'Bancal 1',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 370, position_y: 302, rotation: 0 },
  { id: 'B2',  name: 'Bancal 2',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 459, position_y: 334, rotation: 40 },
  { id: 'B3',  name: 'Bancal 3',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 506, position_y: 416, rotation: 80 },
  { id: 'B4',  name: 'Bancal 4',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 490, position_y: 509, rotation: 120 },
  { id: 'B5',  name: 'Bancal 5',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 417, position_y: 570, rotation: 160 },
  { id: 'B6',  name: 'Bancal 6',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 323, position_y: 570, rotation: 200 },
  { id: 'B7',  name: 'Bancal 7',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 250, position_y: 509, rotation: 240 },
  { id: 'B8',  name: 'Bancal 8',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 234, position_y: 416, rotation: 280 },
  { id: 'B9',  name: 'Bancal 9',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 281, position_y: 334, rotation: 320 },
  // Lateral izquierdo superior
  { id: 'B10', name: 'Bancal 10', type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 66,  position_y: 200, rotation: 90 },
  { id: 'B11', name: 'Bancal 11', type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, irrigation_spacing_cm: null, position_x: 98,  position_y: 200, rotation: 90 },
  // Bancales grandes
  { id: 'B12', name: 'Bancal 12', type: 'large', width_m: 1.2, length_m: 10, irrigation_lines: 2, irrigation_spacing_cm: null, position_x: 710, position_y: 613, rotation: 0 },
  { id: 'B13', name: 'Bancal 13', type: 'large', width_m: 1.2, length_m: 10, irrigation_lines: 2, irrigation_spacing_cm: null, position_x: 710, position_y: 645, rotation: 0 },
  { id: 'B14', name: 'Bancal 14', type: 'large', width_m: 1.2, length_m: 10, irrigation_lines: 2, irrigation_spacing_cm: null, position_x: 790, position_y: 333, rotation: 0 },
  { id: 'B15', name: 'Bancal 15', type: 'large', width_m: 1.2, length_m: 10, irrigation_lines: 2, irrigation_spacing_cm: null, position_x: 790, position_y: 365, rotation: 0 },
  // Zonas especiales
  { id: 'INV', name: 'Invernadero', type: 'greenhouse', width_m: 3, length_m: 8, irrigation_lines: 5, irrigation_spacing_cm: 30, position_x: 790, position_y: 150, rotation: 0 },
  { id: 'PAT', name: 'Patatal',     type: 'patatal',    width_m: 5, length_m: 15, irrigation_lines: 5, irrigation_spacing_cm: null, position_x: 310, position_y: 85,  rotation: 0 },
]

export const ACTION_TYPES: Record<ActionType, { label: string; emoji: string; color: string }> = {
  planted:    { label: 'Plantado',      emoji: '🌱', color: 'var(--green-400)' },
  watered:    { label: 'Regado',        emoji: '💧', color: 'var(--water)' },
  harvested:  { label: 'Cosechado',     emoji: '🧺', color: 'var(--orange-400)' },
  fertilized: { label: 'Abonado',       emoji: '💩', color: 'var(--earth-600)' },
  weeded:     { label: 'Desherbado',    emoji: '🌿', color: 'var(--green-200)' },
  pruned:     { label: 'Podado',        emoji: '✂️', color: 'var(--earth-400)' },
  treated:    { label: 'Tratamiento',   emoji: '🧪', color: 'var(--purple-400)' },
  observed:   { label: 'Observación',   emoji: '👁️', color: 'var(--earth-400)' },
  soil_work:  { label: 'Trabajo suelo', emoji: '⛏️', color: 'var(--orange-600)' },
  other:      { label: 'Otro',          emoji: '📝', color: 'var(--earth-400)' },
}
