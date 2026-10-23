import { Link } from 'react-router-dom'
import SourceBadge from '../components/app/SourceBadge'
import StatCard from '../components/app/StatCard'
import TypeBadge from '../components/app/TypeBadge'
import Em from '../components/ui/Em'
import Icon from '../components/ui/Icon'
import useAuth from '../hooks/useAuth'
import useHistory from '../hooks/useHistory'
import { formatDate } from '../utils/stats'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { history, stats } = useHistory()
  const recent = history.slice(0, 3)

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Seu painel</p>
          <h1 className="text-[clamp(2.4rem,5vw,4.4rem)] font-semibold">
            {greeting()}, <Em>{user.name.split(' ')[0]}.</Em>
          </h1>
        </div>
        <Link to="/gerar" className="btn btn-lime">Gerar novo conteúdo →</Link>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Resumos gerados" value={stats.summaries} />
        <StatCard label="Flashcards criados" value={stats.flashcards} />
        <StatCard label="Itens no histórico" value={stats.total} />
        <StatCard
          highlight={stats.streak > 0}
          label="Sequência de estudo"
          value={
            <span className="inline-flex items-center gap-2">
              {stats.streak}d <Icon name="flame" className="size-6 text-lime" />
            </span>
          }
          sub={stats.streak > 0 ? 'Continue amanhã para manter!' : 'Gere algo hoje para começar'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-line bg-surface p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Atividade recente</h2>
            <Link to="/historico" className="text-xs font-semibold text-lavender hover:underline">Ver tudo</Link>
          </div>
          {recent.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
              Nada por aqui ainda. <Link to="/gerar" className="text-lavender underline">Gere seu primeiro resumo.</Link>
            </p>
          ) : (
            <ul className="grid gap-3">
              {recent.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-ink/50 p-4">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <TypeBadge type={e.type} />
                      <span className="text-[0.7rem] text-muted">{formatDate(e.createdAt)}</span>
                    </div>
                    <p className="truncate font-semibold">{e.topic}</p>
                  </div>
                  <SourceBadge source={e.source} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-violet-bright">Fonte do conteúdo</p>
            <p className="mt-2 text-lg font-bold">API da Wikipédia</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Os resumos e os flashcards de lacuna são montados em tempo real a partir dos artigos da Wikipédia em português.
            </p>
          </div>
          <Link to="/comunidade" className="block rounded-3xl border border-violet/40 bg-violet/15 p-6 transition hover:bg-violet/25">
            <p className="text-lg font-bold">Comunidade</p>
            <p className="mt-1 text-xs text-[#d5d2dd]">Estude baralhos de outros estudantes ou publique o seu.</p>
          </Link>
          <Link to="/explorar" className="block rounded-3xl border border-line bg-surface p-6 transition hover:border-violet-bright/50">
            <p className="text-lg font-bold">Explorar temas</p>
            <p className="mt-1 text-xs text-muted">Pesquise na Wikipédia antes de gerar seu estudo.</p>
          </Link>
        </aside>
      </div>
    </div>
  )
}
