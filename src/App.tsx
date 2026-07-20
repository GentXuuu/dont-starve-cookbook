import { useState, useMemo, useCallback, useRef, useEffect, type MouseEvent } from 'react'
import type { Recipe, DLC } from './types'
import recipes from './data/recipes'
import ingredients from './data/ingredients'
import tags from './data/tags'
import { filterRecipes } from './filter/recipeFilter'
import type { RecipeFilters } from './filter/recipeFilter'
import { reverseLookup } from './filter/reverseLookup'
import type { ReverseLookupResult } from './filter/reverseLookup'
import Header from './components/Header'
import QuickTags from './components/QuickTags'
import RecipeGrid from './components/RecipeGrid'
import LookupResults from './components/LookupResults'
import RecipeModal from './components/RecipeModal'
import FilterPanel from './components/FilterPanel'
import ReverseLookup from './components/ReverseLookup'

type MobileTab = 'grid' | 'filter' | 'reverse'

export default function App() {
  const [dlc, setDLC] = useState<DLC[]>(['DS', 'RoG', 'SW', 'HAM', 'DST'])
  const [quickTags, setQuickTags] = useState<string[]>([])
  const [statMins, setStatMins] = useState({ health: 0, hunger: 0, sanity: 0 })
  const [foodTypes, setFoodTypes] = useState<string[]>([])
  const [excludedTags, setExcludedTags] = useState<string[]>([])
  const [reverseIds, setReverseIds] = useState<string[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [modalClosing, setModalClosing] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('grid')
  const [reverseWidth, setReverseWidth] = useState(280)
  const scrollY = useRef(0)
  const resizing = useRef(false)
  const resizeStartX = useRef(0)
  const resizeStartW = useRef(0)

  const handleResizeStart = useCallback((e: MouseEvent) => {
    resizing.current = true
    resizeStartX.current = e.clientX
    resizeStartW.current = reverseWidth
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [reverseWidth])

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      if (!resizing.current) return
      const dx = resizeStartX.current - e.clientX
      const next = Math.min(500, Math.max(160, resizeStartW.current + dx))
      setReverseWidth(next)
    }
    const onUp = () => {
      if (!resizing.current) return
      resizing.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [])

  const filters: RecipeFilters = useMemo(
    () => ({ dlc, quickTags, statMins, foodTypes, excludedTags }),
    [dlc, quickTags, statMins, foodTypes, excludedTags],
  )

  const filteredRecipes = useMemo(
    () => filterRecipes(recipes, filters),
    [filters],
  )

  const lookupResults: ReverseLookupResult[] | null = useMemo(
    () => (reverseIds.length > 0 ? reverseLookup(recipes, ingredients, reverseIds) : null),
    [reverseIds],
  )

  const handleSelectRecipe = useCallback((recipe: Recipe) => {
    scrollY.current = window.scrollY
    setSelectedRecipe(recipe)
    setModalClosing(false)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalClosing(true)
    setTimeout(() => {
      setSelectedRecipe(null)
      setModalClosing(false)
    }, 120)
  }, [])

  useEffect(() => {
    if (selectedRecipe && !modalClosing) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${scrollY.current}px`
    } else if (!selectedRecipe) {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      window.scrollTo(0, scrollY.current)
    }
  }, [selectedRecipe, modalClosing])

  return (
    <div className="h-screen flex flex-col bg-stone-900 text-stone-100 overflow-hidden">
      <Header dlc={dlc} onDLCChange={setDLC} />
      <QuickTags selected={quickTags} onChange={setQuickTags} />

      {/* Desktop layout (lg+) */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <FilterPanel
          statMins={statMins}
          onStatMinsChange={setStatMins}
          foodTypes={foodTypes}
          onFoodTypesChange={setFoodTypes}
          excludedTags={excludedTags}
          onExcludedTagsChange={setExcludedTags}
        />
        {lookupResults !== null ? (
          <LookupResults
            results={lookupResults}
            tags={tags}
            onSelectRecipe={handleSelectRecipe}
          />
        ) : (
          <RecipeGrid recipes={filteredRecipes} onSelectRecipe={handleSelectRecipe} />
        )}

        {/* Resize handle */}
        <div
          onMouseDown={handleResizeStart}
          className="w-2 cursor-col-resize bg-stone-800 hover:bg-amber-600 transition-colors flex-shrink-0 relative group"
        >
          <div className="absolute inset-y-0 -left-1 right-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 rounded group-hover:bg-amber-400 bg-stone-600 transition-colors" />
        </div>

        <ReverseLookup
          ingredients={ingredients}
          selectedIds={reverseIds}
          onToggle={(id) =>
            setReverseIds((prev) =>
              prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
            )
          }
          width={reverseWidth}
        />
      </div>

      {/* Mobile layout (< lg) */}
      <div className="flex flex-col flex-1 overflow-hidden lg:hidden">
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'grid' &&
            (lookupResults !== null ? (
              <LookupResults
                results={lookupResults}
                tags={tags}
                onSelectRecipe={handleSelectRecipe}
              />
            ) : (
              <RecipeGrid recipes={filteredRecipes} onSelectRecipe={handleSelectRecipe} />
            ))}
          {mobileTab === 'filter' && (
            <div className="flex-1 overflow-auto p-4 space-y-5">
              <FilterPanel
                statMins={statMins}
                onStatMinsChange={setStatMins}
                foodTypes={foodTypes}
                onFoodTypesChange={setFoodTypes}
                excludedTags={excludedTags}
                onExcludedTagsChange={setExcludedTags}
              />
            </div>
          )}
          {mobileTab === 'reverse' && (
            <ReverseLookup
              ingredients={ingredients}
              selectedIds={reverseIds}
              onToggle={(id) =>
                setReverseIds((prev) =>
                  prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                )
              }
            />
          )}
        </div>

        <nav className="flex border-t border-stone-800 bg-stone-900 flex-shrink-0">
          {[
            { key: 'grid', label: '食谱' },
            { key: 'filter', label: '筛选' },
            { key: 'reverse', label: '反查' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key as MobileTab)}
              className={`flex-1 py-3 text-sm font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-amber-500 active:bg-stone-800 ${
                mobileTab === tab.key
                  ? 'text-amber-500 border-t-2 border-amber-500'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          tags={tags}
          onClose={handleCloseModal}
          closing={modalClosing}
        />
      )}
    </div>
  )
}
