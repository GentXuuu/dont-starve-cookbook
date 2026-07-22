# Reverse Lookup Pot Capacity — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4-slot pot capacity awareness to the ingredient reverse-lookup feature. ≤4 ingredients uses current tag-sum logic; >4 ingredients enumerates subsets of size 1-4 and counts viable combinations per recipe.

**Architecture:** The core algorithm change lives in `reverseLookup.ts` with two code paths gated on `selectedIds.length`. A `combinationCount` field flows through `ReverseLookupResult` → `LookupResults` → `RecipeCard` to display an "N种方案" badge.

**Tech Stack:** TypeScript, React, no new dependencies

---

### Task 1: Update types and core algorithm

**Files:**
- Modify: `src/filter/reverseLookup.ts`

- [ ] **Step 1: Add `combinationCount` to `ReverseLookupResult` and update sort order**

```typescript
export interface ReverseLookupResult {
  recipe: Recipe
  craftable: boolean
  missingTags: { tag: string; shortfall: number }[]
  combinationCount: number // NEW: 0 = not craftable, N = number of viable 1-4 ingredient subsets
}
```

- [ ] **Step 2: Add subset enumeration helper `*combinations(arr, size)`**

Insert before `reverseLookup()`:

```typescript
function* subsets<T>(arr: T[], minSize: number, maxSize: number): Generator<T[]> {
  const n = arr.length
  // limit total subsets to avoid freezing UI
  const maxSubsets = 200000
  let count = 0
  for (let size = minSize; size <= maxSize; size++) {
    const indices = Array.from({ length: size }, (_, i) => i)
    while (true) {
      if (++count > maxSubsets) return
      yield indices.map((i) => arr[i])
      // advance to next combination
      let j = size - 1
      while (j >= 0 && indices[j] === n - size + j) j--
      if (j < 0) break
      indices[j]++
      for (let k = j + 1; k < size; k++) indices[k] = indices[k - 1] + 1
    }
  }
}
```

- [ ] **Step 3: Add helper `*checkSubsetSatisfiesRecipe(recipe, combinedTags, selectedIds)`**

```typescript
function checkSubsetSatisfiesRecipe(
  recipe: Recipe,
  combinedTags: Record<string, number>,
  selectedIds: string[],
): { satisfied: boolean; missingTags: { tag: string; shortfall: number }[] } {
  // check exclusions
  if (recipe.exclusions) {
    const hasExcluded = recipe.exclusions.some((tag) => (combinedTags[tag] || 0) > 0)
    if (hasExcluded) return { satisfied: false, missingTags: [] }
  }

  // check tag requirements
  const missingTags = getMissingRequirements(recipe.requirements, combinedTags)

  // check specific ingredient requirements
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
```

- [ ] **Step 4: Replace `reverseLookup()` with dual-path implementation**

```typescript
export function reverseLookup(
  recipes: Recipe[],
  ingredients: Ingredient[],
  selectedIds: string[],
): ReverseLookupResult[] {
  const selected = ingredients.filter((i) => selectedIds.includes(i.id))
  if (selected.length === 0) return []

  if (selected.length <= 4) {
    // ≤4 ingredients: current tag-sum approach + capacity is fine
    const combinedTags: Record<string, number> = {}
    for (const ing of selected) {
      for (const [tag, value] of Object.entries(ing.tags)) {
        combinedTags[tag] = (combinedTags[tag] || 0) + value
      }
    }

    const results: ReverseLookupResult[] = []
    for (const recipe of recipes) {
      if (recipe.priority === -2) continue

      const { satisfied, missingTags } = checkSubsetSatisfiesRecipe(recipe, combinedTags, selectedIds)
      results.push({
        recipe,
        craftable: satisfied,
        missingTags,
        combinationCount: satisfied ? 1 : 0,
      })
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
    const subsetIds = new Set(subset.map((i) => i.id))

    for (const recipe of recipes) {
      if (recipe.priority === -2) continue
      const { satisfied, missingTags } = checkSubsetSatisfiesRecipe(recipe, combinedTags, [...subsetIds])
      if (satisfied) {
        const existing = recipeCounts.get(recipe.id)
        if (existing) {
          existing.count++
        } else {
          recipeCounts.set(recipe.id, { count: 1, missingTags: [] })
        }
      } else if (!recipeCounts.has(recipe.id)) {
        // track best (fewest missing) attempt for nearly-craftable
        if (!recipeCounts.has(recipe.id) || missingTags.length < (recipeCounts.get(recipe.id)?.missingTags.length ?? 99)) {
          recipeCounts.set(recipe.id, { count: 0, missingTags })
        }
      }
    }
  }

  const results: ReverseLookupResult[] = []
  for (const recipe of recipes) {
    if (recipe.priority === -2) continue
    const info = recipeCounts.get(recipe.id)
    if (!info) continue // no viable subset at all
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
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: Clean exit, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/filter/reverseLookup.ts
git commit -m "feat: add pot capacity awareness to reverse lookup"
```

---

### Task 2: Update RecipeCard to show combination count badge

**Files:**
- Modify: `src/components/RecipeCard.tsx`

- [ ] **Step 1: Add `combinationCount` prop**

```typescript
interface Props {
  recipe: Recipe
  onClick: () => void
  dimmed?: boolean
  missingTags?: string[]
  combinationCount?: number // NEW
}
```

- [ ] **Step 2: Destructure and render badge below DLC tags**

In the JSX, after the DLC tags block, add:

```tsx
{combinationCount && combinationCount > 1 && (
  <div className="mt-1.5">
    <span className="text-[10px] px-1 rounded bg-amber-900/50 text-amber-300">
      {combinationCount}种方案
    </span>
  </div>
)}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: Clean exit.

- [ ] **Step 4: Commit**

```bash
git add src/components/RecipeCard.tsx
git commit -m "feat: show combination count badge on recipe card"
```

---

### Task 3: Wire combinationCount through LookupResults

**Files:**
- Modify: `src/components/LookupResults.tsx`

- [ ] **Step 1: Pass `combinationCount` to RecipeCard in both sections**

In the craftable section, change the RecipeCard usage:

```tsx
<RecipeCard
  key={r.recipe.id}
  recipe={r.recipe}
  onClick={() => onSelectRecipe(r.recipe)}
  combinationCount={r.combinationCount}
/>
```

In the nearly section, no change needed (combinationCount is 0 there, so no badge renders).

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc -b --noEmit`
Expected: Clean exit.

- [ ] **Step 3: Commit**

```bash
git add src/components/LookupResults.tsx
git commit -m "feat: pass combinationCount through LookupResults"
```

---

### Task 4: Manual smoke test

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Test ≤4 ingredients**

1. Open http://localhost:5173
2. Select 1-4 ingredients from the right panel
3. Verify "能做" and "还差一点" sections appear correctly
4. Verify no "N种方案" badge on any card (no badge when combinationCount ≤ 1)

- [ ] **Step 3: Test >4 ingredients**

1. Select 5+ ingredients from the right panel
2. Verify "能做" recipes show combination count badge (e.g., "3种方案")
3. Verify "还差一点" recipes still show missing tags

- [ ] **Step 4: Test build**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 5: Commit any fixes if needed**
