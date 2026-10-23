import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'

const SOCIAL = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com',
    path: 'M5.2 8.4H1.6V22h3.6V8.4ZM3.4 2A2.1 2.1 0 1 0 3.4 6.2 2.1 2.1 0 0 0 3.4 2ZM22.4 14.2c0-4.1-2.2-6-5.2-6a4.5 4.5 0 0 0-4 2.2V8.4H9.6V22h3.6v-6.7c0-1.8.3-3.5 2.5-3.5 2.1 0 2.1 2 2.1 3.6V22h3.6v-7.8Z',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Code-Cam-Solutions',
    path: 'M12 2.4a9.7 9.7 0 0 0-3.1 18.9c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.6.3-1.1.6-1.3-2.2-.3-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.8 9.8 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.7-2.3 4.5-4.5 4.8.3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A9.7 9.7 0 0 0 12 2.4Z',
  },
]

const col = 'grid content-start gap-3'
const colTitle = 'mb-2 text-[0.67rem] font-bold uppercase tracking-widest text-[#e4e1e7]'
const colLink = 'text-xs text-[#74717c] transition hover:text-white'

export default function SiteFooter() {
  return (
    <footer className="bg-ink pb-6 pt-20">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-10 pb-16 sm:grid-cols-2 lg:grid-cols-[1.8fr_.7fr_.7fr_.8fr_1fr]">
        <div>
          <Logo />
          <p className="mt-6 text-sm text-[#77737f]">
            Capture o conteúdo.<br />Construa conhecimento.
          </p>
        </div>
        <nav className={col} aria-label="Explore">
          <strong className={colTitle}>Explore</strong>
          <Link className={colLink} to="/#solucao">A solução</Link>
          <Link className={colLink} to="/#publico">Público-alvo</Link>
          <Link className={colLink} to="/#galeria">Galeria</Link>
          <Link className={colLink} to="/explorar">Explorar temas</Link>
        </nav>
        <nav className={col} aria-label="Projeto">
          <strong className={colTitle}>Projeto</strong>
          <Link className={colLink} to="/#equipe">Nossa equipe</Link>
          <Link className={colLink} to="/#contato">Contato</Link>
          <Link className={colLink} to="/login">Entrar no app</Link>
        </nav>
        <nav className={col} aria-label="Redes sociais">
          <strong className={colTitle}>Conecte-se</strong>
          <div className="flex gap-3">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-full border border-line text-[#a9a5b0] transition hover:border-violet-bright hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
        </nav>
        <div className="self-end sm:col-span-2 lg:col-span-1 lg:text-right">
          <span className="block text-[0.6rem] uppercase tracking-[0.12em] text-[#66626f]">Sprint 4 · Challenge 2026</span>
          <strong className="mt-1 block text-sm">JOVI × CodeCam</strong>
        </div>
      </div>
      <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-wrap justify-between gap-3 border-t border-line pt-5 text-[0.65rem] text-[#5e5b66]">
        <p>© {new Date().getFullYear()} CodeCam. Projeto acadêmico — FIAP.</p>
        <Link to="/#inicio">Voltar ao topo ↑</Link>
      </div>
    </footer>
  )
}
