import { useSearchParams } from 'react-router-dom'
import FlashcardDeck from '../components/app/FlashcardDeck'
import SummaryView from '../components/app/SummaryView'
import Icon from '../components/ui/Icon'
import Spinner from '../components/ui/Spinner'
import useGenerator from '../hooks/useGenerator'

const TYPES = [
  { value: 'summary', label: 'Resumo', description: 'Introdução, tópicos e conclusão.', icon: 'layers' },
  { value: 'flashcards', label: 'Flashcards', description: 'Cartões de pergunta e resposta.', icon: 'sparkle' },
  { value: 'both', label: 'Ambos', description: 'Resumo completo + flashcards.', icon: 'camera' },
]
const COUNTS = [2, 3, 4, 5, 8]

function LoadingSkeleton() {
  return (
    <div className="space-y-4 rounded-3xl border border-line bg-surface p-6" aria-busy="true">
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-5/6" /><div className="skeleton h-3 w-4/6" />
      <div className="space-y-3 pt-2">
        {[1, 2, 3].map((k) => <div key={k} className="skeleton h-16 w-full !rounded-xl" />)}
      </div>
    </div>
  )
}

export default function GeneratePage() {
  const [params] = useSearchParams()
  const g = useGenerator(params.get('tema') ?? '')
  const showTabs = g.summary && g.flashcards
  const hasResult = g.summary || g.flashcards
  const wantsCards = g.contentType !== 'summary'

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2 text-center">
        <p className="eyebrow justify-center">Gerar conteúdo</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">O que vamos estudar hoje?</h1>
        <p className="text-sm text-muted">Informe o tema e escolha o que deseja gerar.</p>
      </header>

      <form onSubmit={g.generate} className="space-y-6 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <div>
          <label className="label" htmlFor="topic">Tema da aula</label>
          <input id="topic" className="field" placeholder="Ex.: Fotossíntese, Revolução Francesa, Álgebra Linear..." value={g.topic} onChange={(e) => g.setTopic(e.target.value)} disabled={g.loading} maxLength={200} />
        </div>

        <fieldset>
          <legend className="label">O que deseja gerar?</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {TYPES.map((t) => {
              const on = g.contentType === t.value
              return (
                <button
                  key={t.value}
                  type="button"
                  aria-pressed={on}
                  disabled={g.loading}
                  onClick={() => g.setContentType(t.value)}
                  className={`rounded-2xl border p-4 text-left transition ${on ? 'border-violet bg-violet/15 shadow-[0_0_16px_rgba(109,86,246,.35)]' : 'border-line bg-ink/50 hover:border-violet-bright/40'}`}
                >
                  <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
                    <Icon name={t.icon} className={`size-[18px] ${on ? 'text-lavender' : 'text-muted'}`} /> {t.label}
                  </span>
                  <span className="text-xs text-muted">{t.description}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        {wantsCards && (
          <fieldset>
            <legend className="label">Quantidade de flashcards</legend>
            <div className="flex flex-wrap gap-2">
              {COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={g.cardCount === n}
                  disabled={g.loading}
                  onClick={() => g.setCardCount(n)}
                  className={`min-w-11 rounded-lg border px-4 py-1.5 text-sm font-semibold transition ${g.cardCount === n ? 'border-violet bg-violet' : 'border-line bg-ink/50 text-muted hover:text-white'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {g.error && <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{g.error}</p>}

        <button type="submit" disabled={g.loading || !g.topic.trim()} className="btn btn-primary w-full">
          {g.loading ? <><Spinner /> Gerando conteúdo...</> : 'Gerar conteúdo'}
        </button>
      </form>

      {g.loading && <LoadingSkeleton />}

      {hasResult && !g.loading && (
        <div className="animate-pop space-y-4">
          {showTabs && (
            <div className="flex gap-1 rounded-2xl border border-line bg-surface p-1" role="tablist">
              {[['summary', 'Resumo'], ['flashcards', 'Flashcards']].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={g.activeTab === key}
                  onClick={() => g.setActiveTab(key)}
                  className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${g.activeTab === key ? 'bg-violet text-white shadow-glow' : 'text-muted hover:text-white'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {g.summary && (!showTabs || g.activeTab === 'summary') && <SummaryView summary={g.summary} source={g.source} />}
          {g.flashcards && (!showTabs || g.activeTab === 'flashcards') && <FlashcardDeck cards={g.flashcards} source={g.source} key={g.flashcards.length + g.topic} />}
        </div>
      )}
    </div>
  )
}
