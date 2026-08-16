'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  Save,
  Loader2,
  Calendar,
  Scale,
  Scissors,
} from 'lucide-react'
import { createClient } from '@/supabase/client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface LogEntry {
  id: string
  log_date: string
  weight_kg: number
  waist_cm?: number
  chest_cm?: number
}

export default function LogsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [weight, setWeight] = useState<string>('')
  const [waist, setWaist] = useState<string>('')
  const [chest, setChest] = useState<string>('')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('weekly_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('log_date', { ascending: true })

    if (data && !error) {
      setLogs(data)
      // Auto-fill the latest weight as a starting point for the new log
      if (data.length > 0) {
        setWeight(data[data.length - 1].weight_kg.toString())
      }
    }
    setIsLoading(false)
  }

  const handleSaveLog = async () => {
    if (!weight) return alert('Weight is required')
    setIsSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('weekly_logs').insert({
        user_id: user.id,
        log_date: date,
        weight_kg: parseFloat(weight),
        waist_cm: waist ? parseFloat(waist) : null,
        chest_cm: chest ? parseFloat(chest) : null,
        notes: 'Manual entry',
      })

      if (error) throw error

      // Reset optional fields and refresh chart
      setWaist('')
      setChest('')
      await fetchLogs()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsSaving(false)
    }
  }

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
        <h1 className="text-xl font-light tracking-wide">Measurement Logs</h1>
      </header>

      <div className="no-scrollbar flex-1 space-y-8 overflow-y-auto px-6 pt-4 pb-6">
        {/* Chart Section */}
        <div className="rounded-3xl border border-zinc-800/50 bg-zinc-900/30 p-5">
          <h3 className="mb-6 flex items-center gap-2 text-xs tracking-widest text-zinc-500 uppercase">
            <Scale className="h-4 w-4" /> Weight Progression (kg)
          </h3>

          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-xs text-zinc-600">
              No data logged yet.
            </div>
          ) : (
            <div className="-ml-4 h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={logs}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="log_date"
                    stroke="#71717a"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => {
                      const date = new Date(val)
                      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`
                    }}
                  />
                  <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    stroke="#71717a"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#09090b',
                      borderColor: '#27272a',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#10b981', fontWeight: 600 }}
                    labelStyle={{ color: '#71717a', marginBottom: '4px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight_kg"
                    name="Weight"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: '#0a0a0a',
                      stroke: '#10b981',
                      strokeWidth: 2,
                    }}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#0a0a0a' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Input Form Section */}
        <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="flex items-center gap-2 text-sm font-medium text-white">
            <Calendar className="h-4 w-4 text-emerald-400" /> New Entry
          </h3>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">
                Log Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-white transition-colors focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-zinc-500">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g., 69.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-zinc-700 transition-colors focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/50 pt-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Scissors className="h-3 w-3" /> Waist (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Optional"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-zinc-700 transition-colors focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
                  <Scissors className="h-3 w-3" /> Chest (cm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Optional"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-zinc-700 transition-colors focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveLog}
            disabled={isSaving || !weight}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-3.5 text-sm font-semibold tracking-wide text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin text-black" />
            ) : (
              'Save Entry'
            )}
            {!isSaving && <Save className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
