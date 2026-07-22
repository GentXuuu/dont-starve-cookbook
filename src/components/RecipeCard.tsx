import type { Recipe } from '../types'

interface Props {
  recipe: Recipe
  onClick: () => void
  dimmed?: boolean
  missingTags?: string[]
  combinationCount?: number
}

export default function RecipeCard({ recipe, onClick, dimmed, missingTags, combinationCount }: Props) {
  return (
    <button
      onClick={onClick}
      className={`border rounded-lg p-3 text-left hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 active:translate-y-0 active:shadow-none focus-visible:outline-2 focus-visible:outline-amber-500 transition-all duration-150 cursor-pointer w-full ${
        dimmed
          ? 'bg-stone-800/50 border-stone-700/50 opacity-60 hover:opacity-90'
          : 'bg-stone-800 border-stone-700 hover:border-amber-600'
      }`}
    >
      <h3 className="text-sm font-bold text-stone-100 truncate">{recipe.name.zh}</h3>
      <p className="text-xs text-stone-400 truncate">{recipe.name.en}</p>

      <div className="flex gap-2 mt-2 text-xs">
        <span className="text-green-400" title="生命">
          ❤ {recipe.stats.health}
        </span>
        <span className="text-amber-400" title="饥饿">
          🍖 {recipe.stats.hunger}
        </span>
        <span className="text-blue-400" title="精神">
          🧠 {recipe.stats.sanity}
        </span>
      </div>

      {recipe.specifics && recipe.specifics.length > 0 && (
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {recipe.specifics.map((s) => (
            <span key={s.id} className="text-[10px] px-1 rounded bg-amber-900/50 text-amber-300">
              {s.zh}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-1 mt-1.5 flex-wrap">
        {recipe.dlc.map((d) => (
          <span key={d} className="text-[10px] px-1 rounded bg-stone-700 text-stone-400">
            {d}
          </span>
        ))}
      </div>

      {missingTags && missingTags.length > 0 && (
        <div className="flex gap-1 mt-1.5 flex-wrap items-center">
          <span className="text-[10px] text-amber-400">缺:</span>
          {missingTags.map((label, i) => (
            <span key={i} className="text-[10px] px-1 rounded bg-red-950/50 text-red-300">
              {label}
            </span>
          ))}
        </div>
      )}

      {combinationCount && combinationCount > 1 && (
        <div className="mt-1.5">
          <span className="text-[10px] px-1 rounded bg-amber-900/50 text-amber-300">
            {combinationCount}种方案
          </span>
        </div>
      )}
    </button>
  )
}
