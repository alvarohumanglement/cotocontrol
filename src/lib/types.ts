export type BancalType = 'small' | 'large' | 'greenhouse' | 'patatal'
export type BancalStatus = 'empty' | 'planted' | 'fallow' | 'resting'

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
  | 'other'

export type PlantingStatus = 'active' | 'harvested' | 'failed' | 'removed'

export interface Bancal {
  id: string
  name: string
  type: BancalType
  width_m: number
  length_m: number
  irrigation_lines: number
  irrigation_spacing_cm: number | null
  position_x: number
  position_y: number
  rotation: number
  status: BancalStatus
}

export interface Planting {
  id: string
  bancal_id: string
  crop_name: string
  variety: string | null
  quantity: number | null
  planted_date: string | null
  expected_harvest: string | null
  status: PlantingStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  bancal_id: string
  planting_id: string | null
  action: ActionType
  notes: string | null
  photo_url: string | null
  created_by: string | null
  created_at: string
}

export interface Profile {
  id: string
  display_name: string
  avatar_color: string
  created_at: string
}
