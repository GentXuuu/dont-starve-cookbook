import StatSliders from './StatSliders'
import TypeFilter from './TypeFilter'
import ExcludeFilter from './ExcludeFilter'

interface Props {
  statMins: { health: number; hunger: number; sanity: number }
  onStatMinsChange: (mins: { health: number; hunger: number; sanity: number }) => void
  foodTypes: string[]
  onFoodTypesChange: (types: string[]) => void
  excludedTags: string[]
  onExcludedTagsChange: (tags: string[]) => void
}

export default function FilterPanel({
  statMins,
  onStatMinsChange,
  foodTypes,
  onFoodTypesChange,
  excludedTags,
  onExcludedTagsChange,
}: Props) {
  return (
    <div className="p-4 space-y-5 overflow-auto bg-stone-900 border-r border-stone-800 w-56 flex-shrink-0">
      <StatSliders mins={statMins} onChange={onStatMinsChange} />
      <hr className="border-stone-700" />
      <TypeFilter selected={foodTypes} onChange={onFoodTypesChange} />
      <hr className="border-stone-700" />
      <ExcludeFilter selected={excludedTags} onChange={onExcludedTagsChange} />
    </div>
  )
}
