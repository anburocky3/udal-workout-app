'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  Utensils,
  Flame,
  Clock,
  Dumbbell,
  Cookie,
  Droplets,
  Leaf,
  ChevronDown,
  Activity,
} from 'lucide-react'
import { DIET_RECIPES, MealCategory } from '@/data/dietData'

export default function DietPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<MealCategory | 'All'>('All')

  const filteredRecipes = DIET_RECIPES.filter(
    (recipe) => activeFilter === 'All' || recipe.category === activeFilter,
  )

  const filters: (MealCategory | 'All')[] = [
    'All',
    'Breakfast',
    'Lunch',
    'Snack',
    'Dinner',
  ]

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-6 pb-2">
        <button
          onClick={() => router.back()}
          className="text-zinc-500 transition hover:text-white"
        >
          <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
        </button>
        <h1 className="text-xl font-light tracking-wide">Regional Diet Plan</h1>
      </header>

      <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-6 pt-4 pb-8">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                activeFilter === filter
                  ? 'bg-emerald-500 font-medium text-black'
                  : 'border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Recipe List */}
        <div className="space-y-4 pt-2">
          {filteredRecipes.map((recipe) => (
            <details
              key={recipe.id}
              className="group overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/30 transition-all [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer flex-col gap-3 p-5 transition-colors hover:bg-zinc-900/50">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] tracking-widest text-emerald-400 uppercase">
                      {recipe.category}
                    </span>
                    <h3 className="mt-2 text-base font-medium text-white">
                      {recipe.nameEnglish}
                    </h3>
                    <p className="font-noto-sans-tamil mt-0.5 text-xs text-zinc-500">
                      {recipe.nameTamil}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-500 transition-transform group-open:rotate-180" />
                </div>

                {/* At-a-glance Stats */}
                <div className="flex items-center gap-4 border-t border-zinc-800/50 pt-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{recipe.calories} kcal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{recipe.protein}g Pro</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{recipe.prepTime}</span>
                  </div>
                </div>
              </summary>

              {/* Expanded Content Area */}
              <div className="border-t border-zinc-800/50 bg-[#0a0a0a] px-5 pt-2 pb-5">
                {/* Full Macro Breakdown */}
                <div className="mt-4 mb-6 grid grid-cols-4 gap-2">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-center">
                    <span className="mb-1 block text-[9px] tracking-wider text-zinc-500 uppercase">
                      Protein
                    </span>
                    <span className="text-sm font-medium text-emerald-400">
                      {recipe.protein}g
                    </span>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-center">
                    <span className="mb-1 block text-[9px] tracking-wider text-zinc-500 uppercase">
                      Carbs
                    </span>
                    <span className="text-sm font-medium text-amber-400">
                      {recipe.carbs}g
                    </span>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-center">
                    <span className="mb-1 block text-[9px] tracking-wider text-zinc-500 uppercase">
                      Fats
                    </span>
                    <span className="text-sm font-medium text-sky-400">
                      {recipe.fat}g
                    </span>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-center">
                    <span className="mb-1 block text-[9px] tracking-wider text-zinc-500 uppercase">
                      Fiber
                    </span>
                    <span className="text-sm font-medium text-zinc-300">
                      {recipe.fiber}g
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-xs font-medium text-white">
                      <Utensils className="h-3.5 w-3.5 text-emerald-400" />{' '}
                      Ingredients
                    </h4>
                    <ul className="space-y-1.5">
                      {recipe.ingredients.map((ing, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-zinc-400"
                        >
                          <span className="mt-0.5 text-emerald-500/50">•</span>{' '}
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-xs font-medium text-white">
                      <Activity className="h-3.5 w-3.5 text-emerald-400" />{' '}
                      Preparation
                    </h4>
                    <ol className="space-y-2.5">
                      {recipe.instructions.map((inst, idx) => (
                        <li
                          key={idx}
                          className="flex gap-2 text-xs leading-relaxed text-zinc-400"
                        >
                          <span className="font-mono text-zinc-600">
                            {idx + 1}.
                          </span>
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {recipe.minerals.length > 0 && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-xs font-medium text-white">
                        <Leaf className="h-3.5 w-3.5 text-emerald-400" /> Key
                        Minerals
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.minerals.map((min, idx) => (
                          <span
                            key={idx}
                            className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-400"
                          >
                            {min}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
