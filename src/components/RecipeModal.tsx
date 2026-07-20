import type { Recipe, Tag } from '../types'
import { useEffect } from 'react'

interface Props {
  recipe: Recipe
  tags: Tag[]
  onClose: () => void
  closing: boolean
}

export default function RecipeModal({ recipe, tags, onClose, closing }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const tagName = (tagId: string) => {
    const t = tags.find((t) => t.id === tagId)
    return t ? t.name.zh : tagId
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`bg-stone-800 border border-stone-600 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-auto ${
          closing ? 'animate-modal-content-out' : 'animate-modal-content-in'
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-xl font-bold text-stone-100">{recipe.name.zh}</h2>
            <p className="text-sm text-stone-400">{recipe.name.en}</p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 focus-visible:outline-2 focus-visible:outline-amber-500 active:text-stone-100 text-2xl leading-none rounded transition-colors duration-150"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatBadge label="生命" value={recipe.stats.health} color="text-green-400" />
          <StatBadge label="饥饿" value={recipe.stats.hunger} color="text-amber-400" />
          <StatBadge label="精神" value={recipe.stats.sanity} color="text-blue-400" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-stone-300 mb-4">
          <div>
            <span className="text-stone-500">烹饪时间</span> {recipe.cookTime}s
          </div>
          <div>
            <span className="text-stone-500">保质期</span> {recipe.spoilTime}d
          </div>
          <div>
            <span className="text-stone-500">优先级</span> {recipe.priority}
          </div>
          {recipe.temperature && (
            <div>
              <span className="text-stone-500">温度</span>{' '}
              {recipe.temperature.effect === 'heat' ? '升温' : '降温'}{' '}
              {recipe.temperature.duration}s
            </div>
          )}
        </div>

        {recipe.specifics && recipe.specifics.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-amber-400 mb-1">必需食材</h3>
            <div className="flex gap-1.5 flex-wrap">
              {recipe.specifics.map((s) => (
                <span
                  key={s.id}
                  className="text-sm px-2 py-0.5 rounded bg-amber-900/30 text-amber-300 border border-amber-700/50"
                >
                  {s.zh}
                </span>
              ))}
            </div>
          </div>
        )}

        {recipe.suggestions && (
          <div className="mb-4 bg-stone-900 rounded-lg p-3 border border-stone-700">
            <h3 className="text-sm font-bold text-green-400 mb-1">推荐搭配</h3>
            <p className="text-sm text-stone-200">{recipe.suggestions.zh}</p>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-sm font-bold text-stone-400 mb-1">配方需求</h3>
          <ul className="text-sm text-stone-200 space-y-0.5">
            {recipe.requirements.map((req) => (
              <li key={req.tag}>
                {tagName(req.tag)} ≥ {req.min}
                {req.max !== undefined ? ` (最多 ${req.max})` : ''}
              </li>
            ))}
          </ul>
        </div>

        {recipe.exclusions && recipe.exclusions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-bold text-stone-400 mb-1">禁止食材</h3>
            <p className="text-sm text-red-400">
              {recipe.exclusions.map((e) => tagName(e)).join('、')}
            </p>
          </div>
        )}

        <div className="flex gap-1 flex-wrap mb-4">
          {recipe.dlc.map((d) => (
            <span key={d} className="text-xs px-2 py-0.5 rounded bg-stone-700 text-stone-300">
              {d}
            </span>
          ))}
        </div>

        {recipe.notes && (
          <p className="text-xs text-stone-500 italic">{recipe.notes.zh}</p>
        )}
      </div>
    </div>
  )
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-stone-900 rounded-lg p-2 text-center">
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-stone-500">{label}</div>
    </div>
  )
}
