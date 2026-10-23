import Em from '../ui/Em'
import Icon from '../ui/Icon'
import Reveal from '../ui/Reveal'

const STEPS = [
  { n: '01', icon: 'camera', title: 'Capture', text: 'Fotografe a lousa, uma anotação ou qualquer material relevante da aula.' },
  { n: '02', icon: 'sparkle', title: 'Interprete', text: 'A IA reconhece o conteúdo e entende os principais conceitos presentes na imagem.' },
  { n: '03', icon: 'layers', title: 'Transforme', text: 'Escolha entre resumo, tópicos ou flashcards de acordo com seu objetivo.' },
  { n: '04', icon: 'clock', title: 'Organize', text: 'Salve em pastas por matéria e encontre tudo rapidamente quando for revisar.' },
]

export default function Process() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-paper py-24 text-ink lg:py-36" aria-labelledby="process-title">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <Reveal className="mb-16 grid items-end gap-6 lg:mb-20 lg:grid-cols-[1fr_.42fr] lg:gap-16">
          <div>
            <p className="eyebrow">Como funciona</p>
            <h2 id="process-title" className="text-[clamp(3rem,5.6vw,5.6rem)] font-semibold">
              Um fluxo simples.<br /><Em>Um estudo mais inteligente.</Em>
            </h2>
          </div>
          <p className="text-[0.9rem] leading-[1.8] text-[#6f6b72]">
            Da captura à revisão, cada etapa foi pensada para reduzir esforço operacional e devolver autonomia ao estudante.
          </p>
        </Reveal>

        <ol className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal
              as="li"
              key={s.n}
              delay={i * 90}
              className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[26px] border border-violet/30 bg-linear-to-br from-white to-[#eeebf9] p-6 shadow-[0_12px_30px_rgba(51,38,106,.06)] hover:duration-300 hover:-translate-y-2 hover:bg-violet hover:text-white hover:shadow-[0_22px_45px_rgba(109,86,246,.22)]"
            >
              <span className="absolute -right-14 -top-16 size-[150px] rounded-full bg-violet/10" aria-hidden="true" />
              <span className="relative z-10 min-w-[34px] self-end rounded-full border border-violet/30 px-2 py-1 text-center text-[0.62rem] text-violet group-hover:border-white/40 group-hover:text-white">
                {s.n}
              </span>
              <div className="relative z-10 mb-auto mt-14 grid size-[82px] place-items-center rounded-[22px] bg-violet/10 text-violet transition group-hover:bg-white/15 group-hover:text-white">
                <Icon name={s.icon} className="size-9" strokeWidth={1.5} />
              </div>
              <h3 className="relative z-10 mb-3 mt-8 text-[1.55rem]">{s.title}</h3>
              <p className="relative z-10 text-[0.8rem] leading-[1.7] text-[#6d6970] group-hover:text-white/75">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
