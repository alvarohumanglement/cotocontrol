import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/map', label: 'Mapa', icon: '🗺️' },
  { to: '/bancal', label: 'Bancales', icon: '🌱' },
  { to: '/activity', label: 'Actividad', icon: '📋' },
  { to: '/settings', label: 'Ajustes', icon: '⚙️' },
]

export function BottomNav() {
  return (
    <nav
      className="flex shrink-0"
      style={{
        background: 'var(--earth-900)',
        borderTop: '1px solid var(--earth-800)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className="flex flex-col items-center justify-center flex-1 py-2 no-underline transition-colors"
          style={({ isActive }) => ({
            color: isActive ? 'var(--green-200)' : 'var(--earth-400)',
          })}
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
