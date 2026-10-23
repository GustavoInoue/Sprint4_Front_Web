import useFlashcardSession from '../../hooks/useFlashcardSession'
import SourceBadge from './SourceBadge'

const ANSWERS = [
  { value: 'correct', label: 'Acertei', cls: 'bg-ok text-ink' },
  { value: 'partial', label: 'Parcial', cls: 'bg-violet text-white' },
  { value: 'wrong', label: 'Errei', cls: 'bg-danger text-white' },
]

function ScoreRing({ percent }) {
  const r = 36
  const circ = 2 * Math.PI * r
  return (
    <div className="relative grid size-28 place-items-center">
      <svg width="112" height="112" viewBox="0 0 96 96" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth="7" />
        <circle
          cx="48" cy="48" r={r} fill="none" stroke="var(--color-lime)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${(percent / 100) * circ} ${circ}`}
          style={{ transition: 'stroke-dasharray .8s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <p className="relative text-2xl font-black">{percent}%</p>
    </div>
  )
}

export default function FlashcardDeck({ cards, source }) {
  const s = useFlashcardSession(cards)

  if (s.done) {
    const { correct, partial, wrong, score, label } = s.summary
    return (
      <div className="animate-pop space-y-5">
        <div className="space-y-6 rounded-3xl border border-line bg-surface p-6 text-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Resultado final</p>
            <p className="mt-1 text-xl font-bold">{label}</p>
          </div>
          <div className="flex flex-col items-center gap-6">
            <ScoreRing percent={score} />
            <div className="grid w-full grid-cols-3 gap-3">
              {[
                ['Acertos', correct, 'text-ok'],
                ['Parciais', partial, 'text-lavender'],
                ['Erros', wrong, 'text-danger'],
              ].map(([l, v, c]) => (
                <div key={l} className="rounded-xl border border-line bg-ink/60 p-3">
                  <p className={`text-2xl font-black ${c}`}>{v}</p>
                  <p className="text-xs text-muted">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button type="button" onClick={s.restart} className="btn btn-primary w-full">Revisar novamente</button>
      </div>
    )
  }

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      s.flip()
    }
  }

  return (
    <div className="animate-pop space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Cartão {s.index + 1} de {s.total}</span>
          <span className="flex items-center gap-3">
            <SourceBadge source={source} />
            <span className="text-lavender">{s.progressPct}% concluído</span>
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-linear-to-r from-violet to-lime transition-all duration-500" style={{ width: `${s.progressPct}%` }} />
        </div>
      </div>

      <div
        className="flip-card min-h-[240px] w-full cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-label={s.flipped ? 'Cartão virado. Pressione Enter para ver a pergunta' : 'Pressione Enter para revelar a resposta'}
        onClick={s.flip}
        onKeyDown={onKey}
      >
        <div className={`flip-inner min-h-[240px] w-full ${s.flipped ? 'is-flipped' : ''}`}>
          <div className="flip-face flex min-h-[240px] flex-col justify-between rounded-3xl border border-line bg-surface p-6 shadow-[0_0_0_1px_var(--color-line),0_8px_32px_rgba(109,86,246,.15)]" aria-hidden={s.flipped}>
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-violet/40 bg-violet/15 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-lavender">Pergunta</span>
              <span className="text-xs text-muted">{s.index + 1}/{s.total}</span>
            </div>
            <p className="text-center text-lg font-medium leading-relaxed">{s.current.question}</p>
            <p className="text-center text-xs text-muted">Clique para revelar</p>
          </div>
          <div className="flip-face flip-back flex flex-col justify-between rounded-3xl border border-violet bg-surface p-6 shadow-[0_0_24px_rgba(109,86,246,.4)]" aria-hidden={!s.flipped}>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-violet px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider">Resposta</span>
              <span className="text-xs text-muted">Como foi?</span>
            </div>
            <p className="text-center text-lg font-medium leading-relaxed">{s.current.answer}</p>
            <p className="text-center text-xs text-muted">Avalie seu desempenho abaixo</p>
          </div>
        </div>
      </div>

      {s.flipped ? (
        <div className="grid grid-cols-3 gap-3">
          {ANSWERS.map((a) => (
            <button key={a.value} type="button" onClick={() => s.answer(a.value)} className={`rounded-xl py-3 text-sm font-bold transition active:scale-95 ${a.cls}`}>
              {a.label}
            </button>
          ))}
        </div>
      ) : (
        <button type="button" onClick={s.flip} className="btn btn-primary w-full">Revelar resposta</button>
      )}
    </div>
  )
}
