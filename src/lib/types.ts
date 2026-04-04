export type BancalType = 'small' | 'large' | 'greenhouse' | 'patatal';
export type BancalStatus = 'empty' | 'planted' | 'fallow' | 'resting' | 'available' | 'chickens' | 'waiting_chickens' | 'post_chickens';
export type PlantingStatus = 'active' | 'harvested' | 'failed' | 'removed';
export type ActionType =
  | 'planted'
  | 'watered'
  | 'harvested'
  | 'fertilized'
  | 'weeded'
  | 'pruned'
  | 'treated'
  | 'observed'
  | 'soil_work'
  | 'chickens_in'
  | 'chickens_out'
  | 'other';

export interface Bancal {
  id: string;
  name: string;
  type: BancalType;
  width_m: number;
  length_m: number;
  irrigation_lines: number;
  irrigation_spacing_cm?: number;
  position_x: number;
  position_y: number;
  rotation: number;
  status: BancalStatus;
}

export interface Planting {
  id: string;
  bancal_id: string;
  crop_name: string;
  variety?: string;
  quantity: number;
  planted_date: string;
  expected_harvest?: string;
  status: PlantingStatus;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  bancal_id: string;
  planting_id?: string;
  action: ActionType;
  notes?: string;
  photo_url?: string;
  created_by?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string;
  avatar_color: string;
  created_at: string;
}
