# Don't Starve 食谱大全 — Implementation Plan

## Summary

Build a pure-click, static React + TypeScript + Vite + Tailwind web app for Don't Starve / DST cooking recipes. Data embedded as TS source files. Deploy to GitHub Pages.

## Phases

### Phase 1: Project Scaffold

**Files:**
- `package.json` — react, react-dom, typescript, vite, tailwindcss, @tailwindcss/vite
- `vite.config.ts`
- `tsconfig.json`, `tsconfig.app.json`
- `tailwind.config.ts` (or postcss config if using Tailwind v4 with vite plugin)
- `index.html`
- `src/main.tsx`, `src/App.tsx`, `src/index.css`

**What:** Vite + React + TS + Tailwind scaffold. Verify `npm run dev` works with a blank page.

**Acceptance:** `npm run dev` starts, page renders in browser.

---

### Phase 2: Data Layer

**Files:**
- `src/data/tags.ts` — ~15-20 tag definitions with zh/en names and descriptions
- `src/data/ingredients.ts` — ~50-60 ingredients with tags, categories, DLC availability
- `src/data/recipes.ts` — ~60-70 recipes with stats, tag requirements, exclusions, DLC
- `src/types.ts` — `Recipe`, `Ingredient`, `Tag`, `TagRequirement`, `DLC`, `IngredientCategory` interfaces

**What:** Transcribe all game data into typed TS modules. Tags first (dependencies), then ingredients (reference tags), then recipes (reference both).

**Key data sources:** Don't Starve wiki / game files for exact values.
- Priority: meatballs=1, bacon-and-eggs=10, dragonpie=1, etc.
- Tag values: meat, vegetable, fruit, egg, fish, monster, filler, sweetener, dairy, inedible, etc.
- DLC tagging: DS (base), RoG (Reign of Giants), SW (Shipwrecked), HAM (Hamlet), DST (Together)

**Acceptance:** All types compile. A simple `console.log(recipes)` in App shows full dataset.

---

### Phase 3: Filter Logic (Pure Functions)

**Files:**
- `src/filter/recipeFilter.ts` — `filterRecipes(recipes, filters) => Recipe[]`
- `src/filter/reverseLookup.ts` — `reverseLookup(recipes, selectedIngredients) => Recipe[]`

**What:** Pure functions that take state and return filtered results.

`filterRecipes` handles:
- DLC version toggle (DS/DST intersection/union)
- Quick tag filters (meat, vegetable, fruit, high-health, high-hunger, high-sanity)
- Stat slider minimums (health ≥ X, hunger ≥ X, sanity ≥ X)
- Food type checkboxes (meat_food, vegetable_food, fruit_food, monster_food, etc.)
- Excluded ingredient tags (twigs, ice, monster_meat, etc.)

`reverseLookup`:
- Given selected ingredient IDs, find recipes where all requirements are satisfied by the selected ingredients' tag values
- Rank results by priority (higher = better)
- Flag "nearly craftable" recipes (missing 1-2 tags)

**Acceptance:** Manual tests: call functions with sample state, verify correct results.

---

### Phase 4: Core UI Components

**Files (in order):**
1. `src/components/Header.tsx` — title + DLC version toggle
2. `src/components/VersionToggle.tsx` — DS / DST toggle buttons (both can be on)
3. `src/components/QuickTags.tsx` — horizontal pill buttons for quick filters
4. `src/components/RecipeCard.tsx` — single recipe card (name, icon placeholder, stats bar)
5. `src/components/RecipeGrid.tsx` — responsive grid of RecipeCards
6. `src/components/RecipeModal.tsx` — detail modal on card click
7. `src/components/FilterPanel.tsx` — stat sliders, type checkboxes, exclude checkboxes
8. `src/components/StatSliders.tsx` — health/hunger/sanity range sliders
9. `src/components/TypeFilter.tsx` — food type checkboxes
10. `src/components/ExcludeFilter.tsx` — exclude ingredient checkboxes
11. `src/components/ReverseLookup.tsx` — ingredient groups + lookup button + results
12. `src/components/IngredientGroup.tsx` — collapsible ingredient category with checkboxes
13. `src/components/ResultList.tsx` — reverse lookup results, sorted by priority

**What:** Build components bottom-up. RecipeCard & RecipeGrid first (can test with sample data), then FilterPanel, then ReverseLookup, then RecipeModal, then Header.

**State lives in App.tsx** via useState. No context/routing needed — single page.

**Acceptance:** Each component renders with sample data. Grid shows cards, filter toggles work, modal opens/closes.

---

### Phase 5: Layout & Responsive

**Files:**
- `src/App.tsx` — three-column layout (desktop), single-column tabbed (mobile)
- Update `src/index.css` — Tailwind directives + any custom scroll/overflow styles

**What:** Wire everything together.
- Desktop: `Header` | `QuickTags` | [ `FilterPanel` | `RecipeGrid` | `ReverseLookup` ]
- Mobile: `Header` | `QuickTags` (scrollable) | [tab: RecipeGrid | FilterPanel | ReverseLookup]
- Use Tailwind responsive classes (`lg:`, `md:`, etc.)
- Breakpoint: < 1024px = mobile layout with bottom tab bar

**Acceptance:** Resize browser, layout switches correctly. All interactions work on both layouts.

---

### Phase 6: Polish

**Tasks:**
- Color-coded stat values (health=green, hunger=orange, sanity=blue)
- Hover/active states on all clickable elements
- Transition animations on modal open/close
- Card hover lift effect
- Scroll position preservation when opening/closing modal
- PWA meta tags (optional)
- Favicon

**Acceptance:** Visual polish complete, no jarring UI glitches.

---

### Phase 7: Build & Deploy

**Tasks:**
- `npm run build` produces static `dist/`
- Configure `vite.config.ts` with `base: '/dont-starve-cookbook/'` for GitHub Pages
- Deploy via `gh-pages` npm package or GitHub Action
- Test on actual mobile device

**Acceptance:** Live URL works, all features functional.

---

## State Shape (App.tsx)

```ts
interface AppState {
  dlc: DLC[]                    // selected DLC versions (DS, DST, or both)
  quickTags: string[]           // active quick tag filters
  statMins: { health: number; hunger: number; sanity: number }
  foodTypes: string[]           // checked food type filters
  excludedTags: string[]        // excluded ingredient tags
  reverseLookupIngredients: string[] // selected ingredient IDs for reverse lookup
  reverseLookupResults: Recipe[] | null
  selectedRecipe: Recipe | null // for modal
  mobileTab: 'grid' | 'filter' | 'reverse' // mobile-only
}
```

## Edge Cases to Handle

- No recipes match all filters → show empty state with suggestion to relax filters
- Recipe has no exclusions → don't show exclusion section
- Ingredient not available in selected DLC → gray out / hide
- Slider at zero → no minimum (show all)
- Reverse lookup with zero ingredients selected → disable button, show hint
- All quick tags deselected = show all (same as "全部" selected)
