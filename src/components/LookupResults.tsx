import { useMemo, useCallback } from 'react'
import type { Recipe, Tag } from '../types'
import type { ReverseLookupResult } from '../filter/reverseLookup'
import RecipeCard from './RecipeCard'

interface Props {
  results: ReverseLookupResult[]
  tags: Tag[]
  onSelectRecipe: (recipe: Recipe) => void
}

export default function LookupResults({ results, tags, onSelectRecipe }: Props) {
  const craftable = useMemo(() => results.filter((r) => r.craftable), [results])
  const nearly = useMemo(
    () => results.filter((r) => !r.craftable && r.missingTags.length <= 2),
    [results],
  )

  const tagName = useCallback(
    (tagId: string) => {
      const t = tags.find((t) => t.id === tagId)
      return t ? t.name.zh : tagId
    },
    [tags],
  )

  const formatMissing = (missing: { tag: string; shortfall: number }[]): string[] =>
    missing.map((m) => `${tagName(m.tag)}+${m.shortfall.toFixed(1)}`)

  if (craftable.length === 0 && nearly.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-stone-500 p-8">
        <div className="text-center">
          <p className="text-lg mb-2">选中的食材做不了任何菜</p>
          <p className="text-sm">尝试选择更多食材</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4 space-y-5">
      {craftable.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-green-400 mb-3 sticky top-0 bg-stone-900 py-1 z-10">
            能做 ({craftable.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {craftable.map((r) => (
              <RecipeCard
                key={r.recipe.id}
                recipe={r.recipe}
                onClick={() => onSelectRecipe(r.recipe)}
                combinationCount={r.combinationCount}
              />
            ))}
          </div>
        </section>
      )}

      {nearly.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-amber-400 mb-3 sticky top-0 bg-stone-900 py-1 z-10">
            还差一点 ({nearly.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {nearly.map((r) => (
              <RecipeCard
                key={r.recipe.id}
                recipe={r.recipe}
                onClick={() => onSelectRecipe(r.recipe)}
                dimmed
                missingTags={formatMissing(r.missingTags)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
