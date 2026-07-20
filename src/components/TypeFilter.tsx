const TYPES = [
  { id: 'meat', label: '肉类食物' },
  { id: 'vegetable', label: '蔬菜食物' },
  { id: 'fruit', label: '水果食物' },
  { id: 'fish', label: '鱼类食物' },
  { id: 'egg', label: '蛋类食物' },
  { id: 'monster', label: '怪物食物' },
  { id: 'dairy', label: '乳制食物' },
  { id: 'sweetener', label: '甜味食物' },
]

interface Props {
  selected: string[]
  onChange: (types: string[]) => void
}

export default function TypeFilter({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((t) => t !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div>
      <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">食物类型</h3>
      <div className="space-y-1">
        {TYPES.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer hover:text-stone-100 transition-colors duration-150"
          >
            <input
              type="checkbox"
              checked={selected.includes(t.id)}
              onChange={() => toggle(t.id)}
              className="accent-amber-600"
            />
            {t.label}
          </label>
        ))}
      </div>
    </div>
  )
}
