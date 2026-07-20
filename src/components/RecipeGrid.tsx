import type { Recipe } from '../types'
import RecipeCard from './RecipeCard'

interface Props {
  recipes: Recipe[]
  onSelectRecipe: (recipe: Recipe) => void
}

export default function RecipeGrid({ recipes, onSelectRecipe }: Props) {
  if (recipes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-stone-500 p-8">
        <div className="text-center">
          <p className="text-lg mb-2">没有匹配的食谱</p>
          <p className="text-sm">尝试放宽筛选条件</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => onSelectRecipe(recipe)}
          />
        ))}
      </div>
    </div>
  )
}
