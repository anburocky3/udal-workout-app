'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Utensils, Activity, Info } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  // Helper to determine if a nav item is active
  const isOverview = pathname === '/dashboard'
  const isDiet = pathname === '/diet'
  const isLog = pathname === '/logs'
  const isInfo = pathname.startsWith('/info')

  return (
    <div className="absolute bottom-0 z-50 w-full bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent px-6 pt-4 pb-6">
      <div className="flex items-center justify-between rounded-full border border-zinc-800 bg-zinc-900/90 px-2 py-2 backdrop-blur-md">
        <Link
          href="/dashboard"
          className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2 transition-all duration-300 ${isOverview ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Home className="h-5 w-5 stroke-[1.5]" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link
          href="/diet"
          className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2 transition-all duration-300 ${isDiet ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Utensils className="h-5 w-5 stroke-[1.5]" />
          <span className="text-[10px] font-medium">Diet</span>
        </Link>

        <Link
          href="/logs"
          className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2 transition-all duration-300 ${isLog ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Activity className="h-5 w-5 stroke-[1.5]" />
          <span className="text-[10px] font-medium">Log</span>
        </Link>

        <Link
          href="/info"
          className={`flex flex-1 flex-col items-center gap-1 rounded-full py-2 transition-all duration-300 ${isInfo ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Info className="h-5 w-5 stroke-[1.5]" />
          <span className="text-[10px] font-medium">Info</span>
        </Link>
      </div>
    </div>
  )
}
