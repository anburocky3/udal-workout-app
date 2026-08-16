'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  Flame,
  Dumbbell,
  Cookie,
  Droplets,
  Leaf,
  Activity,
  Zap,
  LogOut,
  Edit3,
  X,
  Save,
  Loader2,
} from 'lucide-react'
import { createClient } from '@/supabase/client'

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense'

interface EditFormData {
  name: string
  weightKg: number
  heightCm: number
  activity: ActivityLevel
  weeklyLossGoalKg: number
}

export default function InfoPage() {
  const router = useRouter()
  const supabase = createClient()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Profile State
  const [formData, setFormData] = useState<EditFormData>({
    name: 'Anbu',
    weightKg: 70,
    heightCm: 172,
    activity: 'light',
    weeklyLossGoalKg: 0.5,
  })

  // Fetch actual data on mount
  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) {
          setFormData({
            name: data.full_name || 'Anbu',
            weightKg: Number(data.starting_weight_kg) || 70,
            heightCm: Number(data.height_cm) || 172,
            activity: (data.activity_level as ActivityLevel) || 'light',
            weeklyLossGoalKg: Number(data.weekly_loss_goal_kg) || 0.5,
          })
        }
      }
      setIsLoading(false)
    }
    loadProfile()
  }, [supabase])

  // Exact Formula Engine
  const results = useMemo(() => {
    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 26,
      light: 30,
      moderate: 35,
      intense: 40,
    }

    const maintenanceCalories = Math.round(
      formData.weightKg * activityMultipliers[formData.activity],
    )
    const calorieDeficit = Math.round((formData.weeklyLossGoalKg * 7700) / 7)
    const targetCalories = maintenanceCalories - calorieDeficit

    const targetProteinGrams = Math.round(formData.weightKg * 1.5)
    const targetFatGrams = Math.round(formData.weightKg * 0.8)
    const targetCarbsGrams = Math.round(formData.weightKg * 3)

    const targetWaterLiters = +((formData.weightKg * 35) / 1000).toFixed(1)
    const targetFiberGrams = Math.round((targetCalories / 1000) * 14)

    const proteinKcal = targetProteinGrams * 4
    const carbKcal = targetCarbsGrams * 4
    const fatKcal = targetFatGrams * 9
    const totalMacroKcal = proteinKcal + carbKcal + fatKcal

    return {
      targetCalories,
      maintenanceCalories,
      calorieDeficit,
      targetProteinGrams,
      targetCarbsGrams,
      targetFatGrams,
      targetFiberGrams,
      targetWaterLiters,
      proteinKcal,
      carbKcal,
      fatKcal,
      totalMacroKcal,
    }
  }, [formData])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSaveEdits = async () => {
    setIsSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          starting_weight_kg: formData.weightKg,
          height_cm: formData.heightCm,
          activity_level: formData.activity,
          weekly_loss_goal_kg: formData.weeklyLossGoalKg,
          target_calories: results.targetCalories,
          target_protein_g: results.targetProteinGrams,
          target_carbs_g: results.targetCarbsGrams,
          target_fat_g: results.targetFatGrams,
        })
        .eq('id', user.id)

      if (error) throw error

      setIsEditing(false)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center pt-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 pb-2">
        <div className="flex items-center gap-4">
          {!isEditing ? (
            <button
              onClick={() => router.back()}
              className="text-zinc-500 transition hover:text-white"
            >
              <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="text-zinc-500 transition hover:text-white"
            >
              <X className="h-6 w-6 stroke-[1.5]" />
            </button>
          )}
          <h1 className="text-xl font-light tracking-wide">
            {isEditing ? 'Edit Profile' : 'My Formula Info'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-zinc-900/50 p-2 text-zinc-400 transition hover:text-emerald-400"
            >
              <Edit3 className="h-4 w-4 stroke-[2]" />
            </button>
          )}
          <button
            onClick={handleLogout}
            className="rounded-full bg-zinc-900/50 p-2 text-zinc-400 transition hover:text-rose-400"
            title="Log Out"
          >
            <LogOut className="h-4 w-4 stroke-[2]" />
          </button>
        </div>
      </header>

      <div className="space-y-6 px-6 pt-4 pb-6">
        {/* EDIT MODE UI */}
        {isEditing ? (
          <div className="animate-in fade-in slide-in-from-right-2 space-y-8 duration-300">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-b border-zinc-800 bg-transparent py-2 text-lg text-white placeholder-zinc-700 transition-colors focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-zinc-500">Weight</span>
                  <span className="text-2xl font-light text-white">
                    {formData.weightKg}{' '}
                    <span className="text-sm text-zinc-600">kg</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="150"
                  value={formData.weightKg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weightKg: Number(e.target.value),
                    })
                  }
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-emerald-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-zinc-500">Height</span>
                  <span className="text-2xl font-light text-white">
                    {formData.heightCm}{' '}
                    <span className="text-sm text-zinc-600">cm</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="135"
                  max="205"
                  value={formData.heightCm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      heightCm: Number(e.target.value),
                    })
                  }
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-emerald-500"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-zinc-500">Target Loss</span>
                  <span className="text-2xl font-light text-emerald-400">
                    {formData.weeklyLossGoalKg}{' '}
                    <span className="text-sm text-zinc-600">kg/wk</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="1.5"
                  step="0.25"
                  value={formData.weeklyLossGoalKg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weeklyLossGoalKg: Number(e.target.value),
                    })
                  }
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-emerald-500"
                />
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-6">
              <span className="mb-4 block text-sm text-zinc-500">
                Daily Activity Level
              </span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'sedentary', label: 'Sedentary' },
                  { id: 'light', label: 'Lightly Active' },
                  { id: 'moderate', label: 'Moderate' },
                  { id: 'intense', label: 'Very Active' },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        activity: act.id as ActivityLevel,
                      })
                    }
                    className={`rounded-2xl border py-3 text-sm transition ${formData.activity === act.id ? 'border-zinc-700 bg-zinc-900 text-white' : 'border-transparent text-zinc-500 hover:bg-zinc-900/30'}`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveEdits}
              disabled={isSaving}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-emerald-500 py-4 text-sm font-semibold tracking-wide text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                'Save Changes'
              )}
              {!isSaving && <Save className="h-4 w-4" />}
            </button>
          </div>
        ) : (
          /* VIEW MODE UI (Formula Info) */
          <div className="animate-in fade-in slide-in-from-left-2 space-y-6 duration-300">
            {/* Energy Expenditure Section */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs tracking-widest text-zinc-500 uppercase">
                <Activity className="h-4 w-4" /> Energy Thermodynamics
              </h3>

              <div className="relative space-y-1 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
                <div className="absolute top-0 left-1/2 -mt-16 h-32 w-32 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
                <p className="text-xs text-zinc-400">Daily Intake Target</p>
                <div className="text-5xl font-light tracking-tighter text-white">
                  {results.targetCalories}
                </div>
                <p className="text-sm font-medium text-emerald-400">
                  kcal / day
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-4">
                  <p className="mb-1 text-xs text-zinc-500">
                    Maintenance (TDEE)
                  </p>
                  <p className="text-xl font-light text-white">
                    {results.maintenanceCalories}{' '}
                    <span className="text-xs text-zinc-600">kcal</span>
                  </p>
                  <p className="mt-2 text-[10px] text-zinc-500">
                    Energy to sustain current weight.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-4">
                  <p className="mb-1 text-xs text-emerald-500">
                    Required Deficit
                  </p>
                  <p className="text-xl font-light text-white">
                    -{results.calorieDeficit}{' '}
                    <span className="text-xs text-zinc-600">kcal</span>
                  </p>
                  <p className="mt-2 text-[10px] text-zinc-500">
                    To lose {formData.weeklyLossGoalKg}kg per week.
                  </p>
                </div>
              </div>
            </div>

            {/* Macronutrients Section */}
            <div className="space-y-4 pt-4">
              <h3 className="flex items-center gap-2 text-xs tracking-widest text-zinc-500 uppercase">
                <Zap className="h-4 w-4" /> Macronutrient Split
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
                  <Dumbbell className="mb-1 h-5 w-5 stroke-[1.5] text-emerald-400" />
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase">
                    Protein
                  </span>
                  <span className="text-2xl font-light text-white">
                    {results.targetProteinGrams}g
                  </span>
                  <span className="mt-1 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400">
                    {results.proteinKcal} kcal
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
                  <Cookie className="mb-1 h-5 w-5 stroke-[1.5] text-amber-400" />
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase">
                    Carbs
                  </span>
                  <span className="text-2xl font-light text-white">
                    {results.targetCarbsGrams}g
                  </span>
                  <span className="mt-1 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400">
                    {results.carbKcal} kcal
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
                  <Droplets className="mb-1 h-5 w-5 stroke-[1.5] text-sky-400" />
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase">
                    Fats
                  </span>
                  <span className="text-2xl font-light text-white">
                    {results.targetFatGrams}g
                  </span>
                  <span className="mt-1 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400">
                    {results.fatKcal} kcal
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800/50 bg-[#0a0a0a] p-3 text-center">
                <p className="text-[10px] text-zinc-500">
                  Combined Macro Yield:{' '}
                  <span className="text-zinc-300">
                    {results.totalMacroKcal} kcal
                  </span>
                </p>
              </div>
            </div>

            {/* Micro & Hydration Section */}
            <div className="space-y-4 pt-4">
              <h3 className="flex items-center gap-2 text-xs tracking-widest text-zinc-500 uppercase">
                <Leaf className="h-4 w-4" /> Micronutrients & Hydration
              </h3>

              <div className="divide-y divide-zinc-800/50 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-900 p-2">
                      <Leaf className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">Dietary Fiber</p>
                      <p className="mt-0.5 text-[10px] text-zinc-500">
                        Slows digestion, 0 kcal yield
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-light text-white">
                      {results.targetFiberGrams}
                    </span>
                    <span className="ml-1 text-xs text-zinc-500">g / day</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-900 p-2">
                      <Droplets className="h-4 w-4 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">Water Intake</p>
                      <p className="mt-0.5 text-[10px] text-zinc-500">
                        Crucial for fat metabolization
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-light text-white">
                      {results.targetWaterLiters}
                    </span>
                    <span className="ml-1 text-xs text-zinc-500">Liters</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
