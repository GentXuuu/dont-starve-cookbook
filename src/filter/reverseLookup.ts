import type { Recipe, Ingredient, TagRequirement } from '../types'

export interface ReverseLookupResult {
  recipe: Recipe
  craftable: boolean
  missingTags: { tag: string; shortfall: number }[]
}

export function reverseLookup(
  recipes: Recipe[],
  ingredients: Ingredient[],
  selectedIds: string[],
): ReverseLookupResult[] {
  const selected = ingredients.filter((i) => selectedIds.includes(i.id))
  if (selected.length === 0) return []

  const combinedTags: Record<string, number> = {}
  for (const ing of selected) {
    for (const [tag, value] of Object.entries(ing.tags)) {
      combinedTags[tag] = (combinedTags[tag] || 0) + value
    }
  }

  const results: ReverseLookupResult[] = []

  for (const recipe of recipes) {
    if (recipe.priority === -2) continue // skip wet goop

    // Check exclusions — if recipe excludes a tag that any selected ingredient has, skip
    if (recipe.exclusions) {
      const hasExcluded = recipe.exclusions.some((tag) => (combinedTags[tag] || 0) > 0)
      if (hasExcluded) continue
    }

    const missingTags = getMissingRequirements(recipe.requirements, combinedTags)
    let craftable = missingTags.length === 0

    // Check specific ingredient requirements
    let missingSpecifics: { tag: string; shortfall: number }[] = []
    if (recipe.specifics && recipe.specifics.length > 0) {
      const hasAllSpecifics = recipe.specifics.every((s) => selectedIds.includes(s.id))
      if (!hasAllSpecifics) {
        craftable = false
        missingSpecifics = recipe.specifics
          .filter((s) => !selectedIds.includes(s.id))
          .map((s) => ({ tag: s.zh, shortfall: 1 }))
      }
    }

    const allMissing = [...missingTags, ...missingSpecifics]

    results.push({ recipe, craftable, missingTags: allMissing })
  }

  // Sort: craftable first, then by priority (higher = better)
  results.sort((a, b) => {
    if (a.craftable !== b.craftable) return a.craftable ? -1 : 1
    return b.recipe.priority - a.recipe.priority
  })

  return results
}

function getMissingRequirements(
  requirements: TagRequirement[],
  combinedTags: Record<string, number>,
): { tag: string; shortfall: number }[] {
  const missing: { tag: string; shortfall: number }[] = []

  for (const req of requirements) {
    const have = combinedTags[req.tag] || 0
    if (have < req.min) {
      missing.push({ tag: req.tag, shortfall: req.min - have })
    }
  }

  return missing
}
