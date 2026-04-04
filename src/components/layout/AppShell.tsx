import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="flex flex-col h-dvh">
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--earth-800)' }}
      >
        <h1
          className="text-xl m-0"
          style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--earth-50)' }}
        >
          Huerta Comunitaria
        </h1>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'var(--green-900)', color: 'var(--green-200)' }}
        >
          Q2 2026
        </span>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  )
}
