import BottomNav from '@/components/bottom-nav'
import React, { Suspense } from 'react'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen justify-center bg-black font-sans font-light text-zinc-100 selection:bg-emerald-500/30">
      <div className="relative flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#0a0a0a]">
        {/* Child Pages (Dashboard, BMI, Info) inject their content here */}
        <div className="no-scrollbar flex-1 overflow-y-auto pb-24">
          <Suspense
            fallback={<div className="p-6 text-zinc-500">Loading...</div>}
          >
            {children}
          </Suspense>
        </div>

        {/* Persistent Bottom Navigation */}
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </div>
    </main>
  )
}
