'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  Info,
  Activity,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Target,
} from 'lucide-react'

export default function BMIPage() {
  const router = useRouter()

  // Placeholder data - in a real app, fetch this from Supabase context
  const currentHeightCm = 172
  const currentWeightKg = 70.0 // Adjusted to your starting weight

  const {
    currentBMI,
    minHealthyWeight,
    maxHealthyWeight,
    weightToLose,
    markerPosition,
  } = useMemo(() => {
    const heightM = currentHeightCm / 100
    const bmi = +(currentWeightKg / (heightM * heightM)).toFixed(1)

    // Calculate Healthy Weight Range based on Indian BMI (18.5 - 22.9)
    const minWeight = +(18.5 * (heightM * heightM)).toFixed(1)
    const maxWeight = +(22.9 * (heightM * heightM)).toFixed(1)

    // Calculate how much to lose to hit the top end of "Normal"
    const toLose = Math.max(0, currentWeightKg - maxWeight).toFixed(1)

    // Visual marker position (Min: 15, Max: 35)
    const visualMin = 15
    const visualMax = 35
    const clampedBMI = Math.max(visualMin, Math.min(bmi, visualMax))
    const position = ((clampedBMI - visualMin) / (visualMax - visualMin)) * 100

    return {
      currentBMI: bmi,
      minHealthyWeight: minWeight,
      maxHealthyWeight: maxWeight,
      weightToLose: toLose,
      markerPosition: position,
    }
  }, [currentHeightCm, currentWeightKg])

  // Asian/Indian BMI Standards
  const bmiCategories = [
    {
      id: 'underweight',
      label: 'Underweight',
      range: '< 18.5',
      color: 'text-sky-400',
      bg: 'bg-sky-400',
      border: 'border-sky-400/30',
      icon: Activity,
      desc: 'May indicate nutritional deficiency. A slight caloric surplus and strength training are recommended.',
    },
    {
      id: 'normal',
      label: 'Healthy Normal',
      range: '18.5 - 22.9',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400',
      border: 'border-emerald-400/30',
      icon: CheckCircle2,
      desc: 'Optimal range for Indian genetics. Maintain with balanced 50-25-25 Tamil diets and consistent movement.',
    },
    {
      id: 'overweight',
      label: 'Overweight',
      range: '23.0 - 24.9',
      color: 'text-amber-400',
      bg: 'bg-amber-400',
      border: 'border-amber-400/30',
      icon: AlertTriangle,
      desc: 'Elevated risk for insulin resistance. A steady calorie deficit (like your formula) is highly effective here.',
    },
    {
      id: 'obese',
      label: 'Obese',
      range: '≥ 25.0',
      color: 'text-rose-400',
      bg: 'bg-rose-400',
      border: 'border-rose-400/30',
      icon: ShieldAlert,
      desc: 'High risk for metabolic syndrome. Strict adherence to your calculated macros and hydration targets is crucial.',
    },
  ]

  return (
    <div className="relative flex min-h-screen w-full max-w-md flex-col bg-[#0a0a0a]">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-8">
        <button
          onClick={() => router.back()}
          className="text-zinc-500 transition hover:text-white"
        >
          <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
        </button>
        <h1 className="text-xl font-medium tracking-wide">BMI Analysis</h1>
      </header>

      <div className="no-scrollbar flex-1 space-y-8 overflow-y-auto px-6 pb-12">
        {/* Visual Gauge Section */}
        <div className="space-y-6">
          <div className="text-center">
            <p className="mb-1 text-sm text-zinc-500">Your Current BMI</p>
            <div className="text-6xl font-light tracking-tighter text-white">
              {currentBMI}
            </div>
            <p className="mt-2 text-sm font-medium text-amber-400">
              Overweight Range
            </p>
          </div>

          {/* The Segmented Bar Chart */}
          <div className="relative pt-4 pb-2">
            <div
              className="absolute top-0 -ml-2 flex flex-col items-center transition-all duration-1000 ease-out"
              style={{ left: `${markerPosition}%` }}
            >
              <div className="mb-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-black shadow-lg">
                {currentBMI}
              </div>
              <div className="h-4 w-0.5 rounded-full bg-white" />
            </div>

            <div className="mt-1 flex h-3 w-full overflow-hidden rounded-full bg-zinc-900">
              <div className="h-full bg-sky-500" style={{ width: '17.5%' }} />
              <div
                className="h-full bg-emerald-500"
                style={{ width: '22.5%' }}
              />
              <div className="h-full bg-amber-500" style={{ width: '10%' }} />
              <div className="h-full bg-rose-500" style={{ width: '50%' }} />
            </div>

            <div className="mt-2 flex justify-between px-1 text-[10px] text-zinc-600">
              <span>15</span>
              <span>18.5</span>
              <span>23</span>
              <span>25</span>
              <span>35+</span>
            </div>
          </div>
        </div>

        {/* New Target Weight Card */}
        <div className="space-y-4 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#0a0a0a] p-5">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-white">
              The Path to Healthy
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs text-zinc-500">Target Weight Range</p>
              <p className="text-lg font-light text-white">
                {minHealthyWeight}{' '}
                <span className="text-xs text-zinc-500">to</span>{' '}
                {maxHealthyWeight}{' '}
                <span className="text-sm text-zinc-600">kg</span>
              </p>
            </div>

            {parseFloat(weightToLose) > 0 && (
              <div className="text-right">
                <p className="mb-1 text-xs text-zinc-500">To reach target</p>
                <p className="text-lg font-medium text-amber-400">
                  -{weightToLose}{' '}
                  <span className="text-sm font-light text-zinc-600">kg</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Asian/Indian Context Warning */}
        <div className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
          <p className="text-xs leading-relaxed text-zinc-400">
            <strong>Indian Standards Applied:</strong> South Asians possess a
            higher percentage of body fat and visceral fat at lower BMIs
            compared to global averages. The healthy threshold is strictly
            capped at 22.9.
          </p>
        </div>

        {/* Categories Detailed Cards */}
        <div className="space-y-3">
          <h3 className="mb-4 pl-1 text-xs tracking-widest text-zinc-500 uppercase">
            Category Breakdown
          </h3>

          {bmiCategories.map((cat) => {
            const isCurrent =
              (currentBMI < 18.5 && cat.id === 'underweight') ||
              (currentBMI >= 18.5 &&
                currentBMI <= 22.9 &&
                cat.id === 'normal') ||
              (currentBMI >= 23.0 &&
                currentBMI <= 24.9 &&
                cat.id === 'overweight') ||
              (currentBMI >= 25.0 && cat.id === 'obese')

            const Icon = cat.icon

            return (
              <div
                key={cat.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isCurrent
                    ? `bg-zinc-900/80 ${cat.border} relative overflow-hidden shadow-lg`
                    : 'border-zinc-800/50 bg-transparent opacity-60'
                }`}
              >
                {isCurrent && (
                  <div
                    className={`absolute top-0 right-0 h-16 w-16 ${cat.bg} -mt-4 -mr-4 rounded-full opacity-10 blur-2xl`}
                  />
                )}

                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${cat.color}`} />
                    <h4
                      className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-zinc-300'}`}
                    >
                      {cat.label}
                    </h4>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">
                    {cat.range}
                  </span>
                </div>

                <p className="mt-2 pl-6 text-xs leading-relaxed text-zinc-400">
                  {cat.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
