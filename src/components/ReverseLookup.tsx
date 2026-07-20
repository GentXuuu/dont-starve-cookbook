import type { Ingredient } from '../types'
import IngredientGroup from './IngredientGroup'

interface Props {
  ingredients: Ingredient[]
  selectedIds: string[]
  onToggle: (id: string) => void
  width?: number
}

const CATEGORIES: { key: string; label: string; sortTag: string }[] = [
  { key: 'meat', label: '肉类', sortTag: 'meat' },
  { key: 'vegetable', label: '蔬菜', sortTag: 'vegetable' },
  { key: 'fruit', label: '水果', sortTag: 'fruit' },
  { key: 'fish', label: '鱼类', sortTag: 'fish' },
  { key: 'egg_dairy', label: '蛋奶', sortTag: 'egg' },
  { key: 'sweetener', label: '甜味剂', sortTag: 'sweetener' },
  { key: 'monster', label: '怪物', sortTag: 'monster' },
  { key: 'filler', label: '填充物', sortTag: 'filler' },
  { key: 'other', label: '其他', sortTag: '' },
]

export default function ReverseLookup({
  ingredients,
  selectedIds,
  onToggle,
  width = 280,
}: Props) {
  return (
    <div
      className="p-4 overflow-auto bg-stone-900 border-l border-stone-800 flex-shrink-0 space-y-3"
      style={{ width }}
    >
      <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wide">食材反查</h3>

      <div className="space-y-2">
        {CATEGORIES.map((cat) => {
          const list = ingredients
            .filter((i) => i.category === cat.key)
            .sort((a, b) => {
              const va = cat.sortTag ? (a.tags[cat.sortTag] || 0) : 0
              const vb = cat.sortTag ? (b.tags[cat.sortTag] || 0) : 0
              return vb - va
            })
          return (
            <IngredientGroup
              key={cat.key}
              label={cat.label}
              ingredients={list}
              selectedIds={selectedIds}
              onToggle={onToggle}
            />
          )
        })}
      </div>

      {selectedIds.length > 0 && (
        <p className="text-xs text-stone-500">
          已选 {selectedIds.length} 种食材
        </p>
      )}
    </div>
  )
}
