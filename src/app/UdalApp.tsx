'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation' // Added for routing
import {
  ArrowRight,
  ChevronLeft,
  Droplets,
  Leaf,
  Cookie,
  Dumbbell,
  Save,
  Loader2,
} from 'lucide-react'
import { createClient } from '@/supabase/client'

type Gender = 'male' | 'female'
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense'

interface UserProfile {
  name: string
  email: string
  password: string
  gender: Gender
  age: number
  weightKg: number
  heightCm: number
  activity: ActivityLevel
  weeklyLossGoalKg: number
}

export default function UdalApp() {
  const router = useRouter()
  const [step, setStep] = useState<number>(1)
  const [isAuthModeSignUp, setIsAuthModeSignUp] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState<UserProfile>({
    name: 'Anbu',
    email: '',
    password: '',
    gender: 'male',
    age: 28,
    weightKg: 70,
    heightCm: 172,
    activity: 'light',
    weeklyLossGoalKg: 0.5,
  })

  const supabase = createClient()

  const results = useMemo(() => {
    const { weightKg, activity, weeklyLossGoalKg } = formData

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 26,
      light: 30,
      moderate: 35,
      intense: 40,
    }
    const maintenanceCalories = Math.round(
      weightKg * activityMultipliers[activity],
    )
    const calorieDeficit = Math.round((weeklyLossGoalKg * 7700) / 7)
    const targetCalories = maintenanceCalories - calorieDeficit

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

  const handleAuthentication = async () => {
    if (!formData.email || !formData.password) {
      alert('Please enter an email and password.')
      return
    }

    setIsProcessing(true)
    try {
      if (isAuthModeSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.name },
          },
        })
        if (error) throw error
        setStep(2) // New users always go to Step 2 to build their profile
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error

        // Check if the user already configured their profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (profile) {
          // Profile exists, push directly to dashboard
          router.push('/dashboard')
        } else {
          // No profile found, continue onboarding
          setStep(2)
        }
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsProcessing(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user)
        throw new Error('Authentication lost. Please reload and login again.')

      const { error: profileError } = await supabase.from('profiles').upsert({
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
      if (profileError) throw profileError

      const { error: logError } = await supabase.from('weekly_logs').insert({
        user_id: user.id,
        weight_kg: formData.weightKg,
        notes: 'Initial setup configuration',
      })
      if (logError) throw logError

      // Successfully saved, route to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setIsProcessing(false)
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
                <h2 className="text-3xl font-light tracking-wide">
                  {isAuthModeSignUp ? 'Welcome' : 'Welcome Back'}
                </h2>
                <p className="text-sm text-zinc-500">
                  Secure your profile to track weekly progress.
                </p>
              </div>

              <div className="space-y-6">
                {isAuthModeSignUp && (
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border-b border-zinc-800 bg-transparent py-3 text-lg text-white placeholder-zinc-700 transition-colors focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border-b border-zinc-800 bg-transparent py-3 text-lg text-white placeholder-zinc-700 transition-colors focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full border-b border-zinc-800 bg-transparent py-3 text-lg text-white placeholder-zinc-700 transition-colors focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  onClick={handleAuthentication}
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Continue'
                  )}
                  {!isProcessing && <ArrowRight className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsAuthModeSignUp(!isAuthModeSignUp)}
                  className="w-full text-center text-xs text-zinc-500 transition hover:text-white"
                >
                  {isAuthModeSignUp
                    ? 'Already have an account? Sign in'
                    : 'Need an account? Sign up'}
                </button>
              </div>
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
                    className={`flex-1 rounded-full py-3 text-sm capitalize transition ${formData.gender === g ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="space-y-10">
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
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-zinc-500">Height</span>
                    <span className="text-2xl font-light">
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
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-zinc-300"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-zinc-500">Age</span>
                    <span className="text-2xl font-light">{formData.age}</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="75"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: Number(e.target.value) })
                    }
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-zinc-300"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in space-y-12 duration-700">
              <div className="space-y-2">
                <h2 className="text-3xl font-light tracking-wide">
                  Pace & Output
                </h2>
                <p className="text-sm text-zinc-500">
                  Fine-tuning your energy expenditure.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="mb-4 flex items-end justify-between">
                    <span className="text-sm text-zinc-500">Target Loss</span>
                    <span className="text-2xl font-light text-emerald-400">
                      {formData.weeklyLossGoalKg}{' '}
                      <span className="text-sm text-zinc-600">kg/week</span>
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
                className="w-full rounded-full bg-white py-4 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Generate Plan
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in no-scrollbar mt-2 max-h-[75vh] space-y-8 overflow-y-auto pb-6 duration-700">
              <div className="space-y-1 text-center">
                <p className="text-xs tracking-widest text-zinc-500 uppercase">
                  Daily Intake Target
                </p>
                <div className="text-6xl font-light tracking-tighter text-white">
                  {results.targetCalories}
                </div>
                <p className="text-sm text-emerald-500/80">kcal / day</p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
                <span>
                  Maintenance:{' '}
                  <strong className="text-zinc-300">
                    {results.maintenanceCalories}
                  </strong>{' '}
                  kcal
                </span>
                <span className="text-zinc-700">|</span>
                <span>
                  Deficit:{' '}
                  <strong className="text-emerald-400">
                    -{results.calorieDeficit}
                  </strong>{' '}
                  kcal
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y border-zinc-900 py-6">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase">
                    Pro
                  </span>
                  <span className="text-2xl font-light">
                    {results.targetProteinGrams}g
                  </span>
                  <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-600">
                    {results.proteinKcal} kcal
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase">
                    Carb
                  </span>
                  <span className="text-2xl font-light">
                    {results.targetCarbsGrams}g
                  </span>
                  <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-600">
                    {results.carbKcal} kcal
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase">
                    Fat
                  </span>
                  <span className="text-2xl font-light">
                    {results.targetFatGrams}g
                  </span>
                  <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-600">
                    {results.fatKcal} kcal
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="mb-4 text-center text-[10px] tracking-widest text-zinc-500 uppercase">
                  Your Body's Mechanics
                </h3>

                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between py-2.5 font-medium text-white transition-colors hover:text-emerald-400">
                    <span className="flex items-center gap-3 text-sm">
                      <Dumbbell className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />
                      Protein (Structural Integrity)
                    </span>
                    <span className="text-zinc-600 transition group-open:rotate-180">
                      <ChevronLeft className="h-4 w-4 -rotate-90" />
                    </span>
                  </summary>
                  <div className="pt-1 pb-3 pl-7 text-[13px] leading-relaxed text-zinc-400">
                    Protein protects your lean muscle tissue during a calorie
                    deficit, ensuring the weight you lose is strictly stored fat
                    rather than functional muscle.
                  </div>
                </details>
                <details className="group border-t border-zinc-900/50 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between py-2.5 font-medium text-white transition-colors hover:text-emerald-400">
                    <span className="flex items-center gap-3 text-sm">
                      <Cookie className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />
                      Carbs & Fats (The Fuel)
                    </span>
                    <span className="text-zinc-600 transition group-open:rotate-180">
                      <ChevronLeft className="h-4 w-4 -rotate-90" />
                    </span>
                  </summary>
                  <div className="pt-1 pb-3 pl-7 text-[13px] leading-relaxed text-zinc-400">
                    <p className="mb-2">
                      <strong>Carbohydrates:</strong> Provide rapid cellular
                      energy for brain function and physical movement.
                    </p>
                    <p>
                      <strong>Fats:</strong> Essential lipids for synthesizing
                      hormones and absorbing vital fat-soluble vitamins.
                    </p>
                  </div>
                </details>
                <details className="group border-t border-zinc-900/50 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between py-2.5 font-medium text-white transition-colors hover:text-emerald-400">
                    <span className="flex items-center gap-3 text-sm">
                      <Leaf className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />
                      Fiber & Hydration
                    </span>
                    <span className="text-zinc-600 transition group-open:rotate-180">
                      <ChevronLeft className="h-4 w-4 -rotate-90" />
                    </span>
                  </summary>
                  <div className="pt-1 pb-3 pl-7 text-[13px] leading-relaxed text-zinc-400">
                    <p className="mb-2">
                      <strong>Fiber ({results.targetFiberGrams}g):</strong>{' '}
                      Plant matter that prevents blood sugar spikes and aids
                      digestion.
                    </p>
                    <p>
                      <strong>Water ({results.targetWaterLiters}L):</strong> Fat
                      metabolization happens in a hydrated environment. Don't
                      skip it.
                    </p>
                  </div>
                </details>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={isProcessing}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-emerald-500 py-4 text-sm font-semibold tracking-wide text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                ) : (
                  'Save Profile & Start Tracking'
                )}
                {!isProcessing && <Save className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
