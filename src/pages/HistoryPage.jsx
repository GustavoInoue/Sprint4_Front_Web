import { useMemo, useState } from 'react'
import FlashcardDeck from '../components/app/FlashcardDeck'
import StatCard from '../components/app/StatCard'
import SummaryView from '../components/app/SummaryView'
import TypeBadge from '../components/app/TypeBadge'
import useHistory from '../hooks/useHistory'
import { formatPercent, scorePercent } from '../utils/math'
import { formatDate } from '../utils/stats'

const FILTERS = [['all', 'Todos'], ['summary', 'Resumos'], ['flashcards', 'Flashcards']]

export default function HistoryPage() {
  const { history, removeEntry, clear, stats } = useHistory()
  const [selectedId, setSelectedId] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const visible = useMemo(
    () =>
      history.filter(
        (e) => (filter === 'all' || e.type === filter) && e.topic.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [history, filter, search],
  )
  const selected = history.find((e) => e.id === selectedId) ?? null
  const totalActions = stats.summaries + stats.flashcards
  const cardRatio = totalActions ? scorePercent(stats.flashcards, totalActions) : 0

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Histórico</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">Tudo o que você já estudou.</h1>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Resumos gerados" value={stats.summaries} />
        <StatCard label="Flashcards gerados" value={stats.flashcards} />
        <StatCard label="Itens no histórico" value={stats.total} />
        <StatCard label="Usando há" value={stats.firstUsedAt ? `${stats.daysUsing}d` : '—'} sub={stats.firstUsedAt ? formatDate(stats.firstUsedAt) : 'Ainda não utilizado'} />
      </div>

      {totalActions > 0 && (
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Distribuição de gerações</p>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={`Resumos ${formatPercent(100 - cardRatio)}, flashcards ${formatPercent(cardRatio)}`}>
            <div className="bg-violet transition-all duration-500" style={{ width: formatPercent(100 - cardRatio) }} />
            <div className="flex-1 bg-ok" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-lavender">Resumos — {formatPercent(100 - cardRatio)}</span>
            <span className="text-ok">Flashcards — {formatPercent(cardRatio)}</span>
          </div>
        </div>
      )}

      {selected && (
        <div className="animate-pop space-y-5 rounded-3xl border border-violet/50 bg-surface p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type={selected.type} />
                <span className="text-xs text-muted">{formatDate(selected.createdAt)}</span>
              </div>
              <h2 className="text-lg font-bold">{selected.topic}</h2>
            </div>
            <button type="button" onClick={() => setSelectedId(null)} className="btn btn-ghost !min-h-9 !px-3 text-xs">Fechar</button>
          </div>
          {selected.type === 'summary' && <SummaryView summary={selected.data} source={selected.source} />}
          {selected.type === 'flashcards' && <FlashcardDeck cards={selected.data} source={selected.source} key={selected.id} />}
        </div>
      )}

      {history.length === 0 ? (
        <div className="space-y-2 rounded-3xl border border-dashed border-line p-10 text-center">
          <p className="text-sm font-medium">Nenhum conteúdo gerado ainda.</p>
          <p className="text-xs text-muted">Vá até “Gerar” e crie seu primeiro resumo ou flashcards.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-full border border-line bg-surface p-1" role="tablist">
              {FILTERS.map(([key, label]) => (
                <button key={key} type="button" role="tab" aria-selected={filter === key} onClick={() => setFilter(key)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${filter === key ? 'bg-violet text-white' : 'text-muted hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>
            <label className="sr-only" htmlFor="history-search">Buscar no histórico</label>
            <input id="history-search" className="field !w-full !py-2.5 sm:!w-64" placeholder="Buscar por tema..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex items-center justify-between px-1 text-xs">
            <p className="font-semibold uppercase tracking-[0.16em] text-muted">Gerações recentes ({visible.length})</p>
            {confirmClear ? (
              <div className="flex items-center gap-3">
                <span className="text-muted">Confirmar?</span>
                <button type="button" onClick={() => { clear(); setSelectedId(null); setConfirmClear(false) }} className="font-bold text-danger">Sim, limpar</button>
                <button type="button" onClick={() => setConfirmClear(false)} className="text-muted">Cancelar</button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmClear(true)} className="text-muted hover:text-white">Limpar tudo</button>
            )}
          </div>

          {visible.length === 0 && <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">Nada encontrado com esses filtros.</p>}

          {visible.map((entry) => {
            const active = selectedId === entry.id
            const count = entry.type === 'flashcards' && Array.isArray(entry.data) ? `${entry.data.length} cartões` : entry.data?.topics ? `${entry.data.topics.length} tópicos` : ''
            return (
              <div key={entry.id} className={`flex items-center justify-between gap-4 rounded-2xl border bg-surface p-4 transition hover:border-violet-bright/50 ${active ? 'border-violet shadow-[0_0_16px_rgba(109,86,246,.35)]' : 'border-line'}`}>
                <button type="button" onClick={() => setSelectedId(active ? null : entry.id)} className="min-w-0 flex-1 space-y-1 text-left">
                  <span className="flex flex-wrap items-center gap-2">
                    <TypeBadge type={entry.type} />
                    <span className="text-xs text-muted">{formatDate(entry.createdAt)}</span>
                  </span>
                  <span className="block truncate text-sm font-semibold">{entry.topic}</span>
                  <span className="block text-xs text-muted">{count}</span>
                </button>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={`text-xs font-semibold ${active ? 'text-lavender' : 'text-muted'}`}>{active ? 'Fechar' : 'Abrir'}</span>
                  <button type="button" onClick={() => { removeEntry(entry.id); if (active) setSelectedId(null) }} className="grid size-8 place-items-center rounded-lg bg-ink text-muted hover:text-danger" aria-label={`Remover ${entry.topic}`} title="Remover">
                    ×
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
