import type { DLC } from '../types'

interface Props {
  selected: DLC[]
  onChange: (dlc: DLC[]) => void
}

const ALL: DLC[] = ['DS', 'RoG', 'SW', 'HAM', 'DST']

export default function VersionToggle({ selected, onChange }: Props) {
  const onlyDS = selected.includes('DS') || selected.includes('RoG') || selected.includes('SW') || selected.includes('HAM')
  const onlyDST = selected.includes('DST')

  return (
    <div className="flex gap-1">
      <button
        onClick={() => onChange(['DS', 'RoG', 'SW', 'HAM'])}
        className={`px-3 py-1 rounded text-sm font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-amber-500 active:scale-95 ${
          onlyDS && !onlyDST
            ? 'bg-amber-600 text-white'
            : 'bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-200'
        }`}
      >
        饥荒
      </button>
      <button
        onClick={() => onChange(['DST'])}
        className={`px-3 py-1 rounded text-sm font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-amber-500 active:scale-95 ${
          onlyDST && !onlyDS
            ? 'bg-amber-600 text-white'
            : 'bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-200'
        }`}
      >
        DST
      </button>
      <button
        onClick={() => onChange(ALL)}
        className={`px-3 py-1 rounded text-sm font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-amber-500 active:scale-95 ${
          selected.length >= 5
            ? 'bg-amber-600 text-white'
            : 'bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-200'
        }`}
      >
        全部
      </button>
    </div>
  )
}
