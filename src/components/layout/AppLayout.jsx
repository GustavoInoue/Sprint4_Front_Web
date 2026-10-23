import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import AccessibilityMenu from '../ui/AccessibilityMenu'
import Icon from '../ui/Icon'
import Logo from '../ui/Logo'

const NAV = [
  { to: '/app', label: 'Painel', icon: 'home', end: true },
  { to: '/gerar', label: 'Gerar', icon: 'sparkle' },
  { to: '/historico', label: 'Histórico', icon: 'clock' },
  { to: '/comunidade', label: 'Comunidade', icon: 'users' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="grid-bg min-h-screen pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4">
          <Logo to="/app" />

          <nav className="hidden items-center gap-1 rounded-full border border-line bg-surface p-1 md:flex" aria-label="Navegação do app">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    isActive ? 'bg-violet text-white shadow-glow' : 'text-muted hover:text-white'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <NavLink to="/explorar" className="hidden text-xs font-semibold text-muted hover:text-white lg:block">
              Explorar temas
            </NavLink>
            <AccessibilityMenu />
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="grid size-9 place-items-center rounded-full bg-violet text-xs font-extrabold" aria-hidden="true">
                {initials}
              </span>
              <span className="max-w-[120px] truncate text-sm font-semibold">{user.name.split(' ')[0]}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:border-danger hover:text-danger"
              aria-label="Sair"
              title="Sair"
            >
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-[min(1180px,calc(100%-32px))] py-10">
        <Outlet />
      </main>

      <nav
        className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-line bg-[#0d0d12]/95 p-1.5 backdrop-blur-xl md:hidden"
        aria-label="Navegação mobile do app"
      >
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl py-2 text-[0.65rem] font-semibold transition ${
                isActive ? 'bg-violet text-white' : 'text-muted'
              }`
            }
          >
            <Icon name={n.icon} className="size-5" />
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
