import type { Bancal, Planting, ActivityLog, ActionType, Profile } from './types';

export const COMUNEROS: Profile[] = [
  { id: 'nacho',  display_name: 'Nacho',  avatar_color: '#5A9A22', created_at: '2026-01-01T00:00:00Z' },
  { id: 'paloma', display_name: 'Paloma', avatar_color: '#8060CC', created_at: '2026-01-01T00:00:00Z' },
  { id: 'carmen', display_name: 'Carmen', avatar_color: '#E07B1A', created_at: '2026-01-01T00:00:00Z' },
  { id: 'sergio', display_name: 'Sergio', avatar_color: '#4AA3CC', created_at: '2026-01-01T00:00:00Z' },
];

export const BANCAL_STATES: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  planted:          { label: 'Plantado',       emoji: '🌱', color: 'var(--green-400)',  bg: 'var(--green-900)' },
  waiting_chickens: { label: 'Esp. gallinas',  emoji: '⏳', color: 'var(--orange-200)', bg: 'var(--earth-800)' },
  chickens:         { label: 'Gallinas',       emoji: '🐔', color: 'var(--orange-400)', bg: 'var(--orange-900)' },
  post_chickens:    { label: 'Para preparar',  emoji: '⛏️', color: 'var(--purple-400)', bg: 'var(--purple-900)' },
  available:        { label: 'Disponible',     emoji: '✅', color: 'var(--green-200)',  bg: 'var(--earth-800)' },
};

export const BANCALES: Bancal[] = [
  // Círculo B1-B9 (5m × 1.2m, 1 línea riego)
  { id: 'B1',  name: 'Bancal 1',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 370, position_y: 302, rotation: 0,   status: 'planted' },
  { id: 'B2',  name: 'Bancal 2',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 459, position_y: 334, rotation: 40,  status: 'planted' },
  { id: 'B3',  name: 'Bancal 3',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 506, position_y: 416, rotation: 80,  status: 'planted' },
  { id: 'B4',  name: 'Bancal 4',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 490, position_y: 509, rotation: 120, status: 'empty' },
  { id: 'B5',  name: 'Bancal 5',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 417, position_y: 570, rotation: 160, status: 'empty' },
  { id: 'B6',  name: 'Bancal 6',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 323, position_y: 570, rotation: 200, status: 'planted' },
  { id: 'B7',  name: 'Bancal 7',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 250, position_y: 509, rotation: 240, status: 'planted' },
  { id: 'B8',  name: 'Bancal 8',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 234, position_y: 416, rotation: 280, status: 'fallow' },
  { id: 'B9',  name: 'Bancal 9',  type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 281, position_y: 334, rotation: 320, status: 'empty' },

  // B10, B11 — Lateral izquierdo superior
  { id: 'B10', name: 'Bancal 10', type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 66,  position_y: 200, rotation: 90,  status: 'planted' },
  { id: 'B11', name: 'Bancal 11', type: 'small', width_m: 1.2, length_m: 5,  irrigation_lines: 1, position_x: 98,  position_y: 200, rotation: 90,  status: 'empty' },

  // Bancales grandes (10m × 1.2m, 2 líneas riego)
  { id: 'B12', name: 'Bancal 12', type: 'large', width_m: 1.2, length_m: 10, irrigation_lines: 2, position_x: 710, position_y: 613, rotation: 0,  status: 'planted' },
  { id: 'B13', name: 'Bancal 13', type: 'large', width_m: 1.2, length_m: 10, irrigation_lines: 2, position_x: 710, position_y: 645, rotation: 0,  status: 'empty' },
  { id: 'B14', name: 'Bancal 14', type: 'large', width_m: 1.2, length_m: 10, irrigation_lines: 2, position_x: 790, position_y: 333, rotation: 0,  status: 'planted' },
  { id: 'B15', name: 'Bancal 15', type: 'large', width_m: 1.2, length_m: 10, irrigation_lines: 2, position_x: 790, position_y: 365, rotation: 0,  status: 'planted' },

  // Zonas especiales
  { id: 'INV', name: 'Invernadero', type: 'greenhouse', width_m: 3,  length_m: 8,  irrigation_lines: 5, irrigation_spacing_cm: 30, position_x: 790, position_y: 150, rotation: 0, status: 'planted' },
  { id: 'PAT', name: 'Patatal',     type: 'patatal',    width_m: 5,  length_m: 15, irrigation_lines: 5, position_x: 310, position_y: 85,  rotation: 0, status: 'planted' },
];

export const ACTION_TYPES: Record<ActionType, { label: string; emoji: string; color: string }> = {
  planted:    { label: 'Plantado',      emoji: '🌱', color: 'var(--green-400)' },
  watered:    { label: 'Regado',        emoji: '💧', color: 'var(--water)' },
  harvested:  { label: 'Cosechado',     emoji: '🧺', color: 'var(--orange-400)' },
  fertilized: { label: 'Abonado',       emoji: '💩', color: 'var(--earth-600)' },
  weeded:     { label: 'Desherbado',    emoji: '🌿', color: 'var(--green-200)' },
  pruned:     { label: 'Podado',        emoji: '✂️', color: 'var(--earth-400)' },
  treated:    { label: 'Tratamiento',   emoji: '🧪', color: 'var(--purple-400)' },
  observed:   { label: 'Observación',   emoji: '👁️', color: 'var(--earth-400)' },
  soil_work:     { label: 'Trabajo suelo',    emoji: '⛏️', color: 'var(--orange-600)' },
  chickens_in:   { label: 'Gallinas entran',  emoji: '🐔', color: 'var(--orange-400)' },
  chickens_out:  { label: 'Gallinas salen',   emoji: '🐔', color: 'var(--green-200)' },
  other:         { label: 'Otro',             emoji: '📝', color: 'var(--earth-400)' },
};

export const CROP_STAGES: Record<number, { label: string; emoji: string; color: string; bg: string }> = {
  0: { label: 'Germinación', emoji: '🫘', color: 'var(--earth-400)',  bg: 'var(--earth-900)' },
  1: { label: 'Desarrollo',  emoji: '🌿', color: 'var(--green-200)',  bg: 'var(--green-900)' },
  2: { label: 'Producción',  emoji: '🍅', color: 'var(--green-400)',  bg: 'var(--green-800)' },
  3: { label: 'Floración',   emoji: '🌸', color: 'var(--purple-200)', bg: 'var(--purple-900)' },
  4: { label: 'Semillas',    emoji: '🌾', color: 'var(--orange-200)', bg: 'var(--orange-900)' },
};

export const MOCK_PLANTINGS: Planting[] = [
  { id: 'p1', bancal_id: 'B1', crop_name: 'Tomates cherry', variety: 'Pera amarillo', quantity: 18, planted_date: '2026-02-15', status: 'active', notes: 'Buen rendimiento Q1', created_at: '2026-02-15T10:00:00Z', updated_at: '2026-02-15T10:00:00Z' },
  { id: 'p2', bancal_id: 'B2', crop_name: 'Lechugas', variety: 'Batavia', quantity: 25, planted_date: '2026-03-01', status: 'active', notes: 'Cosecha escalonada cada 15 días', created_at: '2026-03-01T10:00:00Z', updated_at: '2026-03-01T10:00:00Z' },
  { id: 'p3', bancal_id: 'B2', crop_name: 'Rúcula', quantity: 15, planted_date: '2026-03-01', status: 'active', created_at: '2026-03-01T10:00:00Z', updated_at: '2026-03-01T10:00:00Z' },
  { id: 'p4', bancal_id: 'B3', crop_name: 'Pimientos', variety: 'Padrón + California', quantity: 12, planted_date: '2026-03-10', status: 'active', created_at: '2026-03-10T10:00:00Z', updated_at: '2026-03-10T10:00:00Z' },
  { id: 'p5', bancal_id: 'B6', crop_name: 'Calabacín', quantity: 8, planted_date: '2026-03-05', status: 'active', notes: 'Cuidado con oídio', created_at: '2026-03-05T10:00:00Z', updated_at: '2026-03-05T10:00:00Z' },
  { id: 'p6', bancal_id: 'B7', crop_name: 'Judías verdes', quantity: 30, planted_date: '2026-03-12', status: 'active', notes: 'Con tutores. Fijan nitrógeno.', created_at: '2026-03-12T10:00:00Z', updated_at: '2026-03-12T10:00:00Z' },
  { id: 'p7', bancal_id: 'B8', crop_name: 'Barbecho biológico', variety: 'Gallinas', quantity: 6, planted_date: '2026-01-10', status: 'active', notes: 'Las gallinas fertilizan y limpian. Rotación biológica.', created_at: '2026-01-10T10:00:00Z', updated_at: '2026-01-10T10:00:00Z' },
  { id: 'p8', bancal_id: 'B10', crop_name: 'Cebollas', quantity: 40, planted_date: '2026-02-20', status: 'active', created_at: '2026-02-20T10:00:00Z', updated_at: '2026-02-20T10:00:00Z' },
  { id: 'p9', bancal_id: 'B10', crop_name: 'Zanahorias', quantity: 20, planted_date: '2026-02-20', status: 'active', notes: 'Cebolla repele mosca de la zanahoria', created_at: '2026-02-20T10:00:00Z', updated_at: '2026-02-20T10:00:00Z' },
  { id: 'p10', bancal_id: 'B12', crop_name: 'Tomates', variety: 'Rosa de Barbastro + Corazón de Buey', quantity: 24, planted_date: '2026-03-08', status: 'active', created_at: '2026-03-08T10:00:00Z', updated_at: '2026-03-08T10:00:00Z' },
  { id: 'p11', bancal_id: 'B14', crop_name: 'Berenjenas', quantity: 14, planted_date: '2026-03-10', status: 'active', created_at: '2026-03-10T10:00:00Z', updated_at: '2026-03-10T10:00:00Z' },
  { id: 'p12', bancal_id: 'B14', crop_name: 'Albahaca', quantity: 6, planted_date: '2026-03-10', status: 'active', notes: 'Repelente de pulgón', created_at: '2026-03-10T10:00:00Z', updated_at: '2026-03-10T10:00:00Z' },
  { id: 'p13', bancal_id: 'B15', crop_name: 'Fresas', quantity: 30, planted_date: '2026-02-28', status: 'active', created_at: '2026-02-28T10:00:00Z', updated_at: '2026-02-28T10:00:00Z' },
  { id: 'p14', bancal_id: 'B15', crop_name: 'Espinacas', quantity: 20, planted_date: '2026-02-28', status: 'active', notes: 'Cobertura entre líneas de fresas', created_at: '2026-02-28T10:00:00Z', updated_at: '2026-02-28T10:00:00Z' },
  { id: 'p15', bancal_id: 'INV', crop_name: 'Tomates + Pepinos + Pimientos', quantity: 80, planted_date: '2026-02-10', status: 'active', notes: 'Producción continua', created_at: '2026-02-10T10:00:00Z', updated_at: '2026-02-10T10:00:00Z' },
  { id: 'p16', bancal_id: 'PAT', crop_name: 'Patatas', variety: 'Kennebec + Agria', quantity: 75, planted_date: '2026-02-05', status: 'active', created_at: '2026-02-05T10:00:00Z', updated_at: '2026-02-05T10:00:00Z' },
];

export const MOCK_LOGS: ActivityLog[] = [
  { id: 'l1', bancal_id: 'B1',  action: 'planted',    notes: '18 tomateras cherry puestas', created_at: '2026-02-15T10:30:00Z' },
  { id: 'l2', bancal_id: 'B1',  action: 'watered',    notes: 'Primer riego abundante post-plantación', created_at: '2026-02-15T11:00:00Z' },
  { id: 'l3', bancal_id: 'B8',  action: 'other',      notes: 'Se meten 6 gallinas para barbecho biológico', created_at: '2026-01-10T09:00:00Z' },
  { id: 'l4', bancal_id: 'B3',  action: 'planted',    notes: '12 pimientos (padrón y california)', created_at: '2026-03-10T10:00:00Z' },
  { id: 'l5', bancal_id: 'B12', action: 'planted',    notes: '24 tomateras de mata alta', created_at: '2026-03-08T09:00:00Z' },
  { id: 'l6', bancal_id: 'B7',  action: 'fertilized', notes: 'Humus de lombriz en toda la línea', created_at: '2026-03-11T08:00:00Z' },
  { id: 'l7', bancal_id: 'B6',  action: 'observed',   notes: 'Primeros signos de oídio en hojas bajas', created_at: '2026-03-28T17:00:00Z' },
  { id: 'l8', bancal_id: 'B6',  action: 'treated',    notes: 'Tratamiento con azufre', created_at: '2026-03-29T08:30:00Z' },
  { id: 'l9', bancal_id: 'B2',  action: 'harvested',  notes: 'Primera cosecha de lechugas — 8 unidades', created_at: '2026-03-20T11:00:00Z' },
  { id: 'l10', bancal_id: 'PAT', action: 'soil_work', notes: 'Aporcado de las patatas', created_at: '2026-03-15T09:00:00Z' },
  { id: 'l11', bancal_id: 'INV', action: 'watered',   notes: 'Riego por goteo — 20 min', created_at: '2026-04-01T07:30:00Z' },
  { id: 'l12', bancal_id: 'B15', action: 'harvested', notes: 'Primeras fresas de la temporada — 2kg', created_at: '2026-04-02T10:00:00Z' },
];
