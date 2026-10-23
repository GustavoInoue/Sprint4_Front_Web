import Em from '../ui/Em'
import Reveal from '../ui/Reveal'

const CARDS = [
  {
    n: '01',
    title: 'Informação dispersa',
    text: 'Fotos, cadernos e arquivos sem conexão dificultam encontrar o que realmente importa.',
    icon: <><path d="M13 15h38v34H13z" /><path d="M21 25h22M21 33h17M21 41h12" /></>,
    accent: true,
  },
  {
    n: '02',
    title: 'Tempo desperdiçado',
    text: 'Transcrever a lousa consome o tempo que poderia ser usado para compreender e praticar.',
    icon: <><circle cx="32" cy="32" r="20" /><path d="M32 20v13l9 6" /></>,
  },
  {
    n: '03',
    title: 'Revisão sem estratégia',
    text: 'O mesmo conteúdo exige diferentes formas de estudo. Sem organização, revisar se torna passivo e pouco eficiente.',
    icon: <path d="M10 20h44M15 32h34M21 44h22" />,
    wide: true,
  },
]

export default function Problem() {
  return (
    <section id="problema" className="scroll-mt-20 bg-paper py-24 text-ink lg:py-36" aria-labelledby="problem-title">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-14 lg:grid-cols-[.78fr_1.22fr] lg:gap-28">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">O problema</p>
          <h2 id="problem-title" className="text-[clamp(2.75rem,5.2vw,5rem)] font-semibold">
            Estudar não deveria começar <Em>copiando tudo de novo.</Em>
          </h2>
        </Reveal>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {CARDS.map((c, i) => (
            <Reveal
              as="article"
              key={c.n}
              delay={i * 90}
              className={`flex min-h-[260px] flex-col rounded-3xl border p-6 transition-shadow hover:duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(109,86,246,.14)] ${
                c.accent
                  ? 'border-transparent bg-violet text-white'
                  : 'border-violet/40 border-t-[3px] border-t-violet bg-white/70 hover:bg-white'
              } ${c.wide ? 'sm:col-span-2' : ''}`}
            >
              <span className="self-end text-[0.65rem] opacity-55">{c.n}</span>
              <svg viewBox="0 0 64 64" className="mb-auto mt-3 w-[52px] fill-none stroke-current" strokeWidth="1.5" aria-hidden="true">
                {c.icon}
              </svg>
              <h3 className="mb-3 mt-8 text-2xl">{c.title}</h3>
              <p className={`max-w-[420px] text-[0.84rem] ${c.accent ? 'text-white/70' : 'text-[#68656c]'}`}>{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
