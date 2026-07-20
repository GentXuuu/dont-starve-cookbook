import type { Recipe, DLC } from '../types'

export interface RecipeFilters {
  dlc: DLC[]
  quickTags: string[]
  statMins: { health: number; hunger: number; sanity: number }
  foodTypes: string[]
  excludedTags: string[]
}

export function filterRecipes(recipes: Recipe[], filters: RecipeFilters): Recipe[] {
  const filtered = recipes.filter((recipe) => {
    if (!matchesDLC(recipe, filters.dlc)) return false
    if (!matchesQuickTags(recipe, filters.quickTags)) return false
    if (!matchesStatMins(recipe, filters.statMins)) return false
    if (!matchesFoodTypes(recipe, filters.foodTypes)) return false
    if (!matchesExclusions(recipe, filters.excludedTags)) return false
    return true
  })
  filtered.sort((a, b) => b.priority - a.priority)
  return filtered
}

function matchesDLC(recipe: Recipe, dlc: DLC[]): boolean {
  if (dlc.length === 0) return true
  return dlc.some((d) => recipe.dlc.includes(d))
}

function matchesQuickTags(recipe: Recipe, tags: string[]): boolean {
  if (tags.length === 0) return true

  for (const tag of tags) {
    switch (tag) {
      case 'meat_food':
        if (recipe.requirements.some((r) => r.tag === 'meat')) return true
        break
      case 'vegetable_food':
        if (
          recipe.requirements.some((r) => r.tag === 'vegetable') &&
          !recipe.requirements.some((r) => r.tag === 'meat')
        )
          return true
        break
      case 'fruit_food':
        if (recipe.requirements.some((r) => r.tag === 'fruit')) return true
        break
      case 'fish_food':
        if (recipe.requirements.some((r) => r.tag === 'fish')) return true
        break
      case 'egg_food':
        if (recipe.requirements.some((r) => r.tag === 'egg')) return true
        break
      case 'high_health':
        if (recipe.stats.health >= 30) return true
        break
      case 'high_hunger':
        if (recipe.stats.hunger >= 50) return true
        break
      case 'high_sanity':
        if (recipe.stats.sanity >= 15) return true
        break
      default:
        return true
    }
  }
  return false
}

function matchesStatMins(
  recipe: Recipe,
  mins: { health: number; hunger: number; sanity: number },
): boolean {
  if (mins.health > 0 && recipe.stats.health < mins.health) return false
  if (mins.hunger > 0 && recipe.stats.hunger < mins.hunger) return false
  if (mins.sanity > 0 && recipe.stats.sanity < mins.sanity) return false
  return true
}

function matchesFoodTypes(recipe: Recipe, types: string[]): boolean {
  if (types.length === 0) return true

  for (const type of types) {
    switch (type) {
      case 'meat':
        if (recipe.requirements.some((r) => r.tag === 'meat')) return true
        break
      case 'vegetable':
        if (
          recipe.requirements.some((r) => r.tag === 'vegetable') &&
          !recipe.requirements.some((r) => r.tag === 'meat')
        )
          return true
        break
      case 'fruit':
        if (recipe.requirements.some((r) => r.tag === 'fruit')) return true
        break
      case 'monster':
        if (recipe.requirements.some((r) => r.tag === 'monster')) return true
        break
      case 'egg':
        if (recipe.requirements.some((r) => r.tag === 'egg')) return true
        break
      case 'fish':
        if (recipe.requirements.some((r) => r.tag === 'fish')) return true
        break
      case 'dairy':
        if (recipe.requirements.some((r) => r.tag === 'dairy')) return true
        break
      case 'sweetener':
        if (recipe.requirements.some((r) => r.tag === 'sweetener')) return true
        break
      default:
        return true
    }
  }
  return false
}

function matchesExclusions(recipe: Recipe, excludedTags: string[]): boolean {
  if (excludedTags.length === 0) return true

  for (const tag of excludedTags) {
    if (recipe.requirements.some((r) => r.tag === tag)) return false
  }
  return true
}
