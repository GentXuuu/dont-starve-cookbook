export type DLC = 'DS' | 'RoG' | 'SW' | 'HAM' | 'DST'

export type IngredientCategory =
  | 'meat'
  | 'vegetable'
  | 'fruit'
  | 'egg_dairy'
  | 'monster'
  | 'filler'
  | 'sweetener'
  | 'fish'
  | 'other'

export interface TagRequirement {
  tag: string
  min: number
  max?: number
}

export interface Recipe {
  id: string
  name: { zh: string; en: string }
  stats: { health: number; hunger: number; sanity: number }
  cookTime: number
  spoilTime: number
  priority: number
  requirements: TagRequirement[]
  specifics?: { id: string; zh: string }[]
  suggestions?: { zh: string }
  exclusions?: string[]
  dlc: DLC[]
  temperature?: { effect: 'heat' | 'cool'; duration: number }
  notes?: { zh: string; en: string }
}

export interface Ingredient {
  id: string
  name: { zh: string; en: string }
  tags: Record<string, number>
  category: IngredientCategory
  dlc: DLC[]
}

export interface Tag {
  id: string
  name: { zh: string; en: string }
  description: { zh: string; en: string }
}
