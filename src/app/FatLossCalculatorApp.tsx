'use client'

import React, { useState, useMemo } from 'react'
import {
  ArrowRight,
  ChevronLeft,
  Droplets,
  Leaf,
  Info,
  Activity,
  Flame,
  Dumbbell,
  Cookie,
  Save,
} from 'lucide-react'
import { supabase } from '@/lib/supabase' // Adjust path as needed

type Gender = 'male' | 'female'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense'

interface UserProfile {
  name: string
  gender: Gender
  age: number
  weightKg: number
  heightCm: number
  activity: ActivityLevel
  weeklyLossGoalKg: number // Added dynamic goal
}

export default function UdalApp() {
  const [step, setStep] = useState<number>(1)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState<UserProfile>({
    name: 'Anbu',
    gender: 'male',
    age: 28,
    weightKg: 70,
    heightCm: 172,
    activity: 'light',
    weeklyLossGoalKg: 0.5, // Default to 0.5kg per week
  })

  // Dynamic Calculation Engine
  const results = useMemo(() => {
    const { weightKg, activity, weeklyLossGoalKg } = formData

    // 1. Activity Multipliers adjust the baseline Maintenance
    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 26,
      light: 30, // The baseline from the image
      moderate: 35,
      intense: 40,
    }
    const maintenanceCalories = Math.round(
      weightKg * activityMultipliers[activity],
    )

    // 2. Exact Calorie Deficit based on 1kg fat = 7700 kcal
    // Formula: (Target Kg * 7700) / 7 days
    const calorieDeficit = Math.round((weeklyLossGoalKg * 7700) / 7)
    const targetCalories = maintenanceCalories - calorieDeficit

    // Macros based on image formula
    const targetProteinGrams = Math.round(weightKg * 1.5)
    const targetFatGrams = Math.round(weightKg * 0.8)
    const targetCarbsGrams = Math.round(weightKg * 3)

    const targetWaterLiters = +((weightKg * 35) / 1000).toFixed(1)
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

  // Supabase Save Function
  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Note: Assumes user is already authenticated via Supabase Auth
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert('Please login first!')
        setIsSaving(false)
        return
      }

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: formData.name,
        gender: formData.gender,
        age: formData.age,
        height_cm: formData.heightCm,
        starting_weight_kg: formData.weightKg,
        activity_level: formData.activity,
        weekly_loss_goal_kg: formData.weeklyLossGoalKg,
        target_calories: results.targetCalories,
        target_protein_g: results.targetProteinGrams,
        target_carbs_g: results.targetCarbsGrams,
        target_fat_g: results.targetFatGrams,
      })

      if (error) throw error

      // Create the baseline weight log entry
      await supabase.from('weekly_logs').insert({
        user_id: user.id,
        weight_kg: formData.weightKg,
        notes: 'Starting weight',
      })

      alert('Profile & starting weight saved successfully to Supabase!')
      // Navigate to Dashboard or Diet Options list here
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen justify-center bg-black font-sans font-light text-zinc-100 selection:bg-emerald-500/30">
      <div className="relative flex min-h-screen w-full max-w-md flex-col bg-[#0a0a0a]">
        <header className="flex items-center justify-between px-6 py-8">
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-zinc-500 hover:text-white"
              >
                <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
              </button>
            )}
            <h1 className="font-noto-sans-tamil text-xl font-semibold tracking-widest">
              உடல்
            </h1>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-4 bg-emerald-500' : 'w-1 bg-zinc-800'}`}
              />
            ))}
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-center px-8 pb-12">
          {step === 1 && (
            <div className="animate-in fade-in space-y-12 duration-700">
              <div className="space-y-2">
                <h2 className="text-3xl font-light tracking-wide">Welcome</h2>
                <p className="text-sm text-zinc-500">
                  What should we call you?
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border-b border-zinc-800 bg-transparent py-3 text-lg text-white placeholder-zinc-700 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 text-sm font-medium text-black"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in space-y-12 duration-700">
              <div className="space-y-2">
                <h2 className="text-3xl font-light tracking-wide">Your Body</h2>
                <p className="text-sm text-zinc-500">Basics for the formula.</p>
              </div>

              <div className="flex rounded-full bg-zinc-900/50 p-1">
                {(['male', 'female'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`flex-1 rounded-full py-3 text-sm capitalize ${formData.gender === g ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                {/* Weight, Height, Age Sliders remain identical */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-zinc-500">Weight</span>
                    <span className="text-2xl font-light">
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
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-zinc-300"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 text-sm font-medium text-black"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in space-y-12 duration-700">
              <div className="space-y-2">
                <h2 className="text-3xl font-light tracking-wide">
                  Lifestyle & Pace
                </h2>
                <p className="text-sm text-zinc-500">
                  Fine-tuning your energy expenditure.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="mb-4 flex items-end justify-between">
                    <span className="text-sm text-zinc-500">
                      Target Weight Loss
                    </span>
                    <span className="text-2xl font-light text-emerald-400">
                      {formData.weeklyLossGoalKg}{' '}
                      <span className="text-sm text-zinc-600">kg / week</span>
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
                  <p className="mt-2 text-right text-xs text-zinc-600">
                    Requires a {results.calorieDeficit} kcal daily deficit.
                  </p>
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
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full rounded-full bg-white py-4 text-sm font-medium text-black"
              >
                Generate Plan
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in mt-4 space-y-10 duration-700">
              <div className="space-y-2 text-center">
                <p className="text-sm tracking-widest text-zinc-500 uppercase">
                  Daily Target
                </p>
                <div className="text-6xl font-light tracking-tighter text-white">
                  {results.targetCalories}
                </div>
                <p className="text-sm text-emerald-500/80">kcal / day</p>
              </div>

              <div className="grid grid-cols-3 gap-6 border-b border-zinc-900 pt-4 pb-8">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs tracking-widest text-zinc-500 uppercase">
                    Pro
                  </span>
                  <span className="text-2xl font-light">
                    {results.targetProteinGrams}g
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs tracking-widest text-zinc-500 uppercase">
                    Carb
                  </span>
                  <span className="text-2xl font-light">
                    {results.targetCarbsGrams}g
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs tracking-widest text-zinc-500 uppercase">
                    Fat
                  </span>
                  <span className="text-2xl font-light">
                    {results.targetFatGrams}g
                  </span>
                </div>
              </div>

              {/* Save Profile Button */}
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-emerald-500 py-4 text-sm font-semibold tracking-wide text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? 'Saving to Supabase...'
                  : 'Save Profile & Start Tracking'}
                {!isSaving && <Save className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
