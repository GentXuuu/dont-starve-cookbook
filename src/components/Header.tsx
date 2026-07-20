import type { DLC } from '../types'
import VersionToggle from './VersionToggle'

interface Props {
  dlc: DLC[]
  onDLCChange: (dlc: DLC[]) => void
}

export default function Header({ dlc, onDLCChange }: Props) {
  return (
    <header className="bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-stone-100">饥荒食谱大全</h1>
        <p className="text-xs text-stone-500">Don't Starve Crock Pot Cookbook</p>
      </div>
      <VersionToggle selected={dlc} onChange={onDLCChange} />
    </header>
  )
}
