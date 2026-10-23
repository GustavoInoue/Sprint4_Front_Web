import useSpeech from '../../hooks/useSpeech'
import Icon from '../ui/Icon'
import SourceBadge from './SourceBadge'

export default function SummaryView({ summary, source }) {
  const { title, introduction, topics = [], conclusion, sourceUrl } = summary
  const { supported, speaking, speak, stop } = useSpeech()

  function toggleSpeech() {
    if (speaking) return stop()
    const text = [title, introduction, ...topics.map((t) => `${t.heading}. ${t.content}`), conclusion].filter(Boolean).join('. ')
    return speak(text)
  }

  return (
    <div className="animate-pop space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-bright">Resumo gerado</p>
          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge source={source} />
            {supported && (
              <button type="button" onClick={toggleSpeech} className="btn btn-ghost !min-h-9 !gap-2 !px-3 text-xs" aria-pressed={speaking}>
                <Icon name="volume" className="size-4" /> {speaking ? 'Parar leitura' : 'Ouvir resumo'}
              </button>
            )}
          </div>
        </div>
        <h2 className="text-3xl font-bold leading-tight text-lavender sm:text-4xl">{title}</h2>
      </div>

      <div className="rounded-2xl border border-violet/40 bg-violet/10 p-5">
        <p className="text-sm leading-relaxed text-[#d5d2dd]">{introduction}</p>
      </div>

      <div className="space-y-3">
        {topics.map((topic, i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface p-5 transition hover:border-violet-bright/50">
            <div className="flex items-start gap-4">
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet text-xs font-bold shadow-glow">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="text-base font-semibold tracking-tight">{topic.heading}</h3>
                <p className="text-sm leading-relaxed text-muted">{topic.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {conclusion && (
        <div className="space-y-2 rounded-2xl border border-line border-l-[3px] border-l-violet bg-violet/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-bright">Conclusão</p>
          <p className="text-sm leading-relaxed text-[#d5d2dd]">{conclusion}</p>
        </div>
      )}

      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-muted underline underline-offset-4 hover:text-white">
          Fonte: Wikipédia <Icon name="external" className="size-3.5" />
        </a>
      )}
    </div>
  )
}
