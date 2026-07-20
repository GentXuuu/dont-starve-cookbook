interface TagDef {
  id: string
  label: string
}

const TAGS: TagDef[] = [
  { id: 'meat_food', label: '肉类' },
  { id: 'vegetable_food', label: '蔬菜' },
  { id: 'fruit_food', label: '水果' },
  { id: 'fish_food', label: '鱼类' },
  { id: 'egg_food', label: '蛋类' },
  { id: 'high_health', label: '回血高' },
  { id: 'high_hunger', label: '高饱腹' },
  { id: 'high_sanity', label: '回精神' },
]

interface Props {
  selected: string[]
  onChange: (tags: string[]) => void
}

export default function QuickTags({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((t) => t !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 px-4 flex-shrink-0 scrollbar-hide">
      {TAGS.map((tag) => {
        const active = selected.includes(tag.id)
        return (
          <button
            key={tag.id}
            onClick={() => toggle(tag.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-amber-500 active:scale-95 ${
              active
                ? 'bg-amber-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
            }`}
          >
            {tag.label}
          </button>
        )
      })}
    </div>
  )
}
