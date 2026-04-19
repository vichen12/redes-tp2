import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/transacciones', label: 'Movimientos', icon: '✏️' },
  { to: '/metas', label: 'Metas', icon: '🎯' },
  { to: '/presupuesto', label: 'Presupuesto', icon: '💸' },
  { to: '/categorias', label: 'Categorías', icon: '🏷️' },
]

export default function Navbar() {
  const { darkMode, setDarkMode } = useApp()

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💵</span>
          <div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">TuFinanza</span>
            <span className="hidden sm:inline ml-2 text-xs text-green-500 font-semibold uppercase tracking-wide">Contabilidad Inteligente</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }>
              <span>{item.icon}</span><span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <button onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Mobile bottom bar */}
      <div className="md:hidden flex border-t border-gray-100 dark:border-gray-800">
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
              }`
            }>
            <span className="text-lg mb-0.5">{item.icon}</span>
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
