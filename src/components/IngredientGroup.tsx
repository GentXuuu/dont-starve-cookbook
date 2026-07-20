import type { Ingredient } from '../types'
import { useState } from 'react'

const TAG_LABELS: Record<string, string> = {
  meat: '肉',
  vegetable: '菜',
  fruit: '果',
  fish: '鱼',
  egg: '蛋',
  monster: '怪',
  dairy: '奶',
  sweetener: '甜',
  seafood: '海鲜',
  frozen: '冰',
  decoration: '装饰',
  inedible: '不可食',
  filler: '填充',
}

function formatTags(tags: Record<string, number>): string {
  return Object.entries(tags)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${TAG_LABELS[k] || k}${v % 1 === 0 ? v : v}`)
    .join(' ')
}

interface Props {
  label: string
  ingredients: Ingredient[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

export default function IngredientGroup({
  label,
  ingredients,
  selectedIds,
  onToggle,
}: Props) {
  const [open, setOpen] = useState(true)

  const selectedCount = ingredients.filter((i) => selectedIds.includes(i.id)).length

  if (ingredients.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-bold text-stone-400 hover:text-stone-200 focus-visible:outline-2 focus-visible:outline-amber-500 w-full text-left py-1 rounded transition-colors duration-150"
      >
        <span className="text-xs">{open ? '▼' : '▶'}</span>
        <span>{label}</span>
        <span className={selectedCount > 0 ? 'text-amber-400' : 'text-stone-500'}>
          ({selectedCount}/{ingredients.length})
        </span>
      </button>
      {open && (
        <div className="ml-3 space-y-0.5 mt-1">
          {ingredients.map((ing) => (
            <label
              key={ing.id}
              className="flex items-center gap-1.5 text-sm text-stone-300 cursor-pointer hover:text-stone-100 transition-colors duration-150"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(ing.id)}
                onChange={() => onToggle(ing.id)}
                className="accent-amber-600"
              />
              {ing.name.zh}
              <span className="text-stone-500 ml-auto text-xs">
                {formatTags(ing.tags)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
