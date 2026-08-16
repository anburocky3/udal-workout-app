'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Plus,
  ChevronRight,
  Flame,
  Scale,
  Calendar,
  Droplets,
  Leaf,
  LogOut,
  LineChart as LineChartIcon,
  Loader2,
  CheckCircle2,
  Circle,
  Dumbbell,
  Cookie,
} from 'lucide-react'
import { createClient } from '@/supabase/client'
import { useRouter } from 'next/navigation'
import {
  ResponsiveContainer,
  YAxis,
  Tooltip,
  Line,
  LineChart as RechartsLineChart,
  LineChart,
} from 'recharts'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userData, setUserData] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Gamification State for Daily Checklist
  const [dailyGoals, setDailyGoals] = useState({
    protein: false,
    carbs: false,
    fats: false,
    water: false,
    fiber: false,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Fetch User Profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        // Fetch Logs for the chart and latest weight
        const { data: logData } = await supabase
          .from('weekly_logs')
          .select('log_date, weight_kg')
          .eq('user_id', user.id)
          .order('log_date', { ascending: true })

        if (logData) {
          setLogs(logData)
        }

        if (profile) {
          // Determine current weight from the latest log, fallback to starting weight
          const currentWeight =
            logData && logData.length > 0
              ? logData[logData.length - 1].weight_kg
              : profile.starting_weight_kg

          // Dynamic Calculations based on latest weight
          const heightM = profile.height_cm / 100
          const bmi = +(currentWeight / (heightM * heightM)).toFixed(1)
          const water = +((currentWeight * 35) / 1000).toFixed(1)
          const fiber = Math.round((profile.target_calories / 1000) * 14)

          setUserData({
            name: profile.full_name || 'Anbu',
            currentWeight: currentWeight,
            startWeight: profile.starting_weight_kg,
            bmi: bmi,
            targetCalories: profile.target_calories,
            protein: profile.target_protein_g,
            carbs: profile.target_carbs_g,
            fats: profile.target_fat_g,
            water: water,
            fiber: fiber,
          })
        }
      }
      setIsLoading(false)
    }

    fetchDashboardData()
  }, [])

  if (isLoading || !userData) {
    return (
      <div className="flex h-full w-full items-center justify-center pt-32">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
      </div>
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const toggleGoal = (key: keyof typeof dailyGoals) => {
    setDailyGoals((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Calculate overall progress
  const completedGoals = Object.values(dailyGoals).filter(Boolean).length
  const totalGoals = Object.keys(dailyGoals).length

  const checklistItems = [
    {
      id: 'water',
      label: `Drink ${userData.water}L Water`,
      icon: Droplets,
      color: 'text-sky-400',
    },
    {
      id: 'fiber',
      label: `Take ${userData.fiber}g Fiber`,
      icon: Leaf,
      color: 'text-emerald-400',
    },
    {
      id: 'protein',
      label: `Hit ${userData.protein}g Protein`,
      icon: Dumbbell,
      color: 'text-emerald-400',
    },
    {
      id: 'carbs',
      label: `Eat ${userData.carbs}g Carbs`,
      icon: Cookie,
      color: 'text-amber-400',
    },
    {
      id: 'fats',
      label: `Eat ${userData.fats}g Fats`,
      icon: Flame,
      color: 'text-sky-400',
    },
  ] as const

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 pb-2">
        <div>
          <h1 className="text-xl font-light tracking-wide">
            Hello, {userData.name}
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            {completedGoals === totalGoals
              ? 'Amazing! All targets hit today.'
              : 'Ready to hit your targets?'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/info"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-emerald-400 transition hover:bg-zinc-800"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-full bg-zinc-900/50 p-2 text-zinc-400 transition hover:text-rose-400"
            title="Log Out"
          >
            <LogOut className="h-4 w-4 stroke-[2]" />
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="space-y-6 px-6 pt-4 pb-12">
        {/* TAB 1: OVERVIEW & FORMULA */}
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
          {/* Hero Calorie Card */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-900/50 p-6">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs tracking-widest text-zinc-500 uppercase">
                <Flame className="h-3.5 w-3.5 text-emerald-400" /> Daily Target
              </p>
              <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[10px] text-zinc-400">
                {completedGoals}/{totalGoals} Goals
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-light tracking-tighter text-white transition-colors duration-500">
                {userData.targetCalories}
              </span>
              <span className="text-sm text-zinc-500">kcal</span>
            </div>

            {/* Macro Progress Bars (Now Linked to Gamified State) */}
            <div className="mt-8 space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-zinc-400">
                    Protein ({userData.protein}g)
                  </span>
                  <span
                    className={`font-medium transition-colors duration-500 ${dailyGoals.protein ? 'text-emerald-400' : 'text-zinc-500'}`}
                  >
                    {dailyGoals.protein
                      ? `${userData.protein}g eaten`
                      : '0g eaten'}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out"
                    style={{ width: dailyGoals.protein ? '100%' : '0%' }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-zinc-400">
                    Carbs ({userData.carbs}g)
                  </span>
                  <span
                    className={`font-medium transition-colors duration-500 ${dailyGoals.carbs ? 'text-amber-400' : 'text-zinc-500'}`}
                  >
                    {dailyGoals.carbs ? `${userData.carbs}g eaten` : '0g eaten'}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-1000 ease-out"
                    style={{ width: dailyGoals.carbs ? '100%' : '0%' }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-zinc-400">Fats ({userData.fats}g)</span>
                  <span
                    className={`font-medium transition-colors duration-500 ${dailyGoals.fats ? 'text-sky-400' : 'text-zinc-500'}`}
                  >
                    {dailyGoals.fats ? `${userData.fats}g eaten` : '0g eaten'}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all duration-1000 ease-out"
                    style={{ width: dailyGoals.fats ? '100%' : '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gamified Checklist */}
          <div className="space-y-3">
            <h3 className="px-1 text-xs tracking-widest text-zinc-500 uppercase">
              Daily Protocol
            </h3>
            <div className="space-y-1 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-2">
              {checklistItems.map((item) => {
                const Icon = item.icon
                const isChecked = dailyGoals[item.id as keyof typeof dailyGoals]

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      toggleGoal(item.id as keyof typeof dailyGoals)
                    }
                    className={`flex w-full items-center justify-between rounded-xl p-3 transition-all duration-300 ${
                      isChecked
                        ? 'bg-zinc-950/50 opacity-60'
                        : 'bg-transparent hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 transition-colors duration-300 ${isChecked ? 'bg-zinc-900' : 'border border-zinc-800 bg-zinc-950'}`}
                      >
                        <Icon
                          className={`h-4 w-4 ${isChecked ? 'text-zinc-600' : item.color}`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium transition-all duration-300 ${isChecked ? 'text-zinc-500 line-through' : 'text-white'}`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div>
                      {isChecked ? (
                        <CheckCircle2 className="h-5 w-5 scale-110 text-emerald-500 transition-all duration-300" />
                      ) : (
                        <Circle className="h-5 w-5 text-zinc-600 transition-all duration-300" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* BMI Widget */}
          <Link
            href="/bmi"
            className="group flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-5 transition hover:bg-zinc-900/50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-zinc-900 p-3 transition group-hover:scale-105">
                <Scale className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-white">
                  Current BMI
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600 transition group-hover:translate-x-1" />
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Healthy Range (18.5 - 22.9)
                </p>
              </div>
            </div>
            <span className="text-xl font-bold text-white">{userData.bmi}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
