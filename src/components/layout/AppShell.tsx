import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../hooks/useAuth';

export function AppShell() {
  const { profile } = useAuth();

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
          CotoControl
        </h1>
        {profile && (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--earth-400)' }}>
              Hola, {profile.display_name}
            </span>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: profile.avatar_color, color: 'white' }}
            >
              {profile.display_name[0]}
            </div>
          </div>
        )}
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
