import type { Recipe, Ingredient, TagRequirement } from '../types'

export interface ReverseLookupResult {
  recipe: Recipe
  craftable: boolean
  missingTags: { tag: string; shortfall: number }[]
  combinationCount: number
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

function checkRecipe(
  recipe: Recipe,
  combinedTags: Record<string, number>,
  selectedIds: string[],
): { satisfied: boolean; missingTags: { tag: string; shortfall: number }[] } {
  if (recipe.exclusions) {
    const hasExcluded = recipe.exclusions.some((tag) => (combinedTags[tag] || 0) > 0)
    if (hasExcluded) return { satisfied: false, missingTags: [] }
  }

  const missingTags = getMissingRequirements(recipe.requirements, combinedTags)

  let missingSpecifics: { tag: string; shortfall: number }[] = []
  if (recipe.specifics && recipe.specifics.length > 0) {
    const hasAllSpecifics = recipe.specifics.every((s) => selectedIds.includes(s.id))
    if (!hasAllSpecifics) {
      missingSpecifics = recipe.specifics
        .filter((s) => !selectedIds.includes(s.id))
        .map((s) => ({ tag: s.zh, shortfall: 1 }))
    }
  }

  const allMissing = [...missingTags, ...missingSpecifics]
  return { satisfied: allMissing.length === 0, missingTags: allMissing }
}

function* subsets<T>(arr: T[], minSize: number, maxSize: number): Generator<T[]> {
  const n = arr.length
  const maxSubsets = 200000
  let count = 0
  for (let size = minSize; size <= maxSize; size++) {
    const indices = Array.from({ length: size }, (_, i) => i)
    while (true) {
      if (++count > maxSubsets) return
      yield indices.map((i) => arr[i])
      let j = size - 1
      while (j >= 0 && indices[j] === n - size + j) j--
      if (j < 0) break
      indices[j]++
      for (let k = j + 1; k < size; k++) indices[k] = indices[k - 1] + 1
    }
  }
}

export function reverseLookup(
  recipes: Recipe[],
  ingredients: Ingredient[],
  selectedIds: string[],
): ReverseLookupResult[] {
  const selected = ingredients.filter((i) => selectedIds.includes(i.id))
  if (selected.length === 0) return []

  // ≤4 ingredients: tag sum approach (guaranteed to fit in pot)
  if (selected.length <= 4) {
    const combinedTags: Record<string, number> = {}
    for (const ing of selected) {
      for (const [tag, value] of Object.entries(ing.tags)) {
        combinedTags[tag] = (combinedTags[tag] || 0) + value
      }
    }

    const results: ReverseLookupResult[] = []
    for (const recipe of recipes) {
      if (recipe.priority === -2) continue
      const { satisfied, missingTags } = checkRecipe(recipe, combinedTags, selectedIds)
      results.push({ recipe, craftable: satisfied, missingTags, combinationCount: satisfied ? 1 : 0 })
    }

    results.sort((a, b) => {
      if (a.craftable !== b.craftable) return a.craftable ? -1 : 1
      return b.recipe.priority - a.recipe.priority
    })
    return results
  }

  // >4 ingredients: enumerate subsets of size 1-4
  const recipeCounts = new Map<string, { count: number; missingTags: { tag: string; shortfall: number }[] }>()

  for (const subset of subsets(selected, 1, 4)) {
    const combinedTags: Record<string, number> = {}
    for (const ing of subset) {
      for (const [tag, value] of Object.entries(ing.tags)) {
        combinedTags[tag] = (combinedTags[tag] || 0) + value
      }
    }
    const subsetIds = subset.map((i) => i.id)

    for (const recipe of recipes) {
      if (recipe.priority === -2) continue
      const { satisfied, missingTags } = checkRecipe(recipe, combinedTags, subsetIds)
      if (satisfied) {
        const existing = recipeCounts.get(recipe.id)
        if (existing) {
          existing.count++
        } else {
          recipeCounts.set(recipe.id, { count: 1, missingTags: [] })
        }
      } else if (!recipeCounts.has(recipe.id)) {
        recipeCounts.set(recipe.id, { count: 0, missingTags })
      }
    }
  }

  const results: ReverseLookupResult[] = []
  for (const recipe of recipes) {
    if (recipe.priority === -2) continue
    const info = recipeCounts.get(recipe.id)
    if (!info) continue
    results.push({
      recipe,
      craftable: info.count > 0,
      missingTags: info.missingTags,
      combinationCount: info.count,
    })
  }

  results.sort((a, b) => {
    if (a.craftable !== b.craftable) return a.craftable ? -1 : 1
    return b.recipe.priority - a.recipe.priority
  })
  return results
}
