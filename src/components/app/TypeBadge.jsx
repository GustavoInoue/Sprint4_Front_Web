const MAP = {
  summary: { label: 'Resumo', cls: 'border-violet/40 bg-violet/15 text-lavender' },
  flashcards: { label: 'Flashcards', cls: 'border-ok/30 bg-ok/10 text-ok' },
}

export default function TypeBadge({ type }) {
  const s = MAP[type] ?? { label: type, cls: 'border-line text-muted' }
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider ${s.cls}`}>
      {s.label}
    </span>
  )
}
