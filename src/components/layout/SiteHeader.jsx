import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import AccessibilityMenu from '../ui/AccessibilityMenu'
import Logo from '../ui/Logo'

const LINKS = [
  { to: '/#solucao', label: 'A solução' },
  { to: '/#publico', label: 'Público-alvo' },
  { to: '/#galeria', label: 'Galeria' },
  { to: '/#equipe', label: 'Nossa equipe' },
  { to: '/#contato', label: 'Contato' },
]

export default function SiteHeader() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const cta = user ? { to: '/app', label: 'Meu painel' } : { to: '/login', label: 'Entrar' }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.08] bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[68px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-6 lg:min-h-[78px]">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex xl:gap-9" aria-label="Navegação principal">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-[0.78rem] font-semibold text-[#b4b1bc] transition hover:text-white">
              {l.label}
            </Link>
          ))}
          <NavLink
            to="/explorar"
            className={({ isActive }) =>
              `text-[0.78rem] font-semibold transition hover:text-white ${isActive ? 'text-lime' : 'text-[#b4b1bc]'}`
            }
          >
            Explorar
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <AccessibilityMenu />
          <Link
            to={cta.to}
            className="hidden items-center gap-3 rounded-full border border-line px-4 py-2.5 text-[0.76rem] font-bold transition hover:border-white/25 hover:bg-surface-2 sm:inline-flex"
          >
            {cta.label} <span className="text-base text-violet-bright" aria-hidden="true">↗</span>
          </Link>
          <button
            type="button"
            className="grid size-10 place-content-center gap-1.5 rounded-[10px] border border-line lg:hidden"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`block h-px w-[18px] bg-white transition ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`block h-px w-[18px] bg-white transition ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="grid border-t border-line bg-[#0d0d12] px-4 pb-5 pt-2 lg:hidden" aria-label="Navegação mobile">
          {[...LINKS, { to: '/explorar', label: 'Explorar' }, cta].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="border-b border-white/[0.06] px-1 py-3.5 text-[0.9rem]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
