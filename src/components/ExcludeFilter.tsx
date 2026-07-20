const EXCLUDES = [
  { id: 'inedible', label: '含树枝' },
  { id: 'frozen', label: '含冰块' },
  { id: 'monster', label: '含怪物肉' },
  { id: 'warly', label: '大厨专属' },
]

interface Props {
  selected: string[]
  onChange: (tags: string[]) => void
}

export default function ExcludeFilter({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((t) => t !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div>
      <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">排除食材</h3>
      <div className="space-y-1">
        {EXCLUDES.map((e) => (
          <label
            key={e.id}
            className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer hover:text-stone-100 transition-colors duration-150"
          >
            <input
              type="checkbox"
              checked={selected.includes(e.id)}
              onChange={() => toggle(e.id)}
              className="accent-amber-600"
            />
            {e.label}
          </label>
        ))}
      </div>
    </div>
  )
}
