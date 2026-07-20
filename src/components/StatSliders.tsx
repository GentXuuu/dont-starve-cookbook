interface Props {
  mins: { health: number; hunger: number; sanity: number }
  onChange: (mins: { health: number; hunger: number; sanity: number }) => void
}

export default function StatSliders({ mins, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wide">属性筛选</h3>

      <SliderRow
        label="生命"
        color="text-green-400"
        value={mins.health}
        onChange={(v) => onChange({ ...mins, health: v })}
        max={100}
      />
      <SliderRow
        label="饥饿"
        color="text-amber-400"
        value={mins.hunger}
        onChange={(v) => onChange({ ...mins, hunger: v })}
        max={150}
      />
      <SliderRow
        label="精神"
        color="text-blue-400"
        value={mins.sanity}
        onChange={(v) => onChange({ ...mins, sanity: v })}
        max={50}
      />
    </div>
  )
}

function SliderRow({
  label,
  color,
  value,
  onChange,
  max,
}: {
  label: string
  color: string
  value: number
  onChange: (v: number) => void
  max: number
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-medium w-8 ${color}`}>{label}</span>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 accent-amber-600 cursor-pointer"
      />
      <span className="text-xs text-stone-400 w-6 text-right">
        {value > 0 ? `≥${value}` : '-'}
      </span>
    </div>
  )
}
