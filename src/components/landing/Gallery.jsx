import useCarousel from '../../hooks/useCarousel'
import Em from '../ui/Em'
import Reveal from '../ui/Reveal'

const SLIDES = [
  { key: 'home', tag: 'INÍCIO', title: 'Início', sub: 'Visão rápida da rotina', msg: 'Uma visão clara para acompanhar sua rotina de estudos.', alt: 'Tela inicial do CodeCam' },
  { key: 'capture', tag: 'CAPTURA', title: 'Captura', sub: 'Conteúdo em um clique', msg: 'Registre o conteúdo da aula em um único gesto.', alt: 'Tela de captura da lousa pelo CodeCam' },
  { key: 'summary', tag: 'RESUMO', title: 'Resumo', sub: 'Compreensão sem ruído', msg: 'A inteligência transforma a imagem em compreensão.', alt: 'Resumo criado por inteligência artificial' },
  { key: 'flashcards', tag: 'FLASHCARDS', title: 'Flashcards', sub: 'Revisão que envolve', msg: 'Revise de forma ativa e memorize melhor.', alt: 'Flashcards de revisão no CodeCam' },
  { key: 'folders', tag: 'PASTAS', title: 'Pastas', sub: 'Tudo no lugar certo', msg: 'Organize cada matéria no lugar certo.', alt: 'Pastas de matérias no CodeCam' },
]

const arrow = 'grid size-11 place-items-center rounded-full border border-line text-lg transition hover:border-violet-bright hover:bg-violet/20'

export default function Gallery() {
  const { index, goTo, next, prev, setPaused } = useCarousel(SLIDES.length, 3500)
  const active = SLIDES[index]

  return (
    <section id="galeria" className="scroll-mt-20 bg-ink py-24 lg:py-36" aria-labelledby="gallery-title">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <Reveal className="mb-14 grid items-end gap-6 lg:mb-20 lg:grid-cols-[1fr_.35fr] lg:gap-16">
          <div>
            <p className="eyebrow">Galeria</p>
            <h2 id="gallery-title" className="text-[clamp(3rem,5.6vw,5.6rem)] font-semibold">
              Uma experiência contínua.<br /><Em>Da captura à revisão.</Em>
            </h2>
          </div>
          <p className="text-[0.85rem] leading-[1.8] text-muted">
            Uma simulação das principais partes do app: da captura da aula à organização e revisão do conteúdo.
          </p>
        </Reveal>

        <Reveal
          className="relative grid items-center gap-6 overflow-hidden rounded-[30px] border border-line bg-linear-to-br from-[#12121a] via-[#1a1730] to-[#0d0d12] px-5 py-8 lg:min-h-[560px] lg:grid-cols-[.72fr_1.4fr_.72fr] lg:px-0 lg:py-0"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Principais telas do CodeCam"
        >
          <div className="relative z-[4] order-2 lg:order-1 lg:self-end lg:p-7 lg:pb-[60px]" aria-live="polite">
            <span className="block text-[0.61rem] font-extrabold tracking-[0.14em] text-violet-bright">{active.tag}</span>
            <p key={active.key} className="mt-4 max-w-[220px] animate-pop text-[0.9rem] leading-[1.7] text-[#b0acb8]">{active.msg}</p>
            <div className="mt-7 flex items-center gap-1.5" role="tablist" aria-label="Escolher tela">
              {SLIDES.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Ir para ${s.title}`}
                  onClick={() => goTo(i)}
                  className={`h-[3px] rounded transition-all ${i === index ? 'w-9 bg-violet-bright' : 'w-[22px] bg-[#373440] hover:bg-[#55515f]'}`}
                />
              ))}
            </div>
          </div>

          <div className="relative order-1 grid min-h-[510px] place-items-center lg:order-2 lg:min-h-[560px]">
            <div className="absolute size-[min(370px,80vw)] rounded-full bg-[radial-gradient(circle,rgba(109,86,246,.44),rgba(109,86,246,.09)_48%,transparent_70%)]" aria-hidden="true" />
            <div className="relative z-[2] h-[440px] w-[204px] rotate-3 overflow-hidden rounded-[30px] border-8 border-[#292832] bg-ink shadow-[0_34px_76px_rgba(0,0,0,.7),0_0_68px_rgba(109,86,246,.24)] sm:h-[478px] sm:w-[222px]">
              <span className="absolute left-1/2 top-2 z-[5] h-[15px] w-[62px] -translate-x-1/2 rounded-b-[13px] bg-ink" aria-hidden="true" />
              {SLIDES.map((s, i) => (
                <figure
                  key={s.key}
                  aria-hidden={i !== index}
                  className={`absolute inset-0 transition duration-700 ${i === index ? 'scale-100 opacity-100' : 'scale-[.97] opacity-0'}`}
                >
                  <img src={`/assets/screens/gallery-${s.key}-hq.webp`} alt={s.alt} loading="lazy" className="h-full w-full object-cover" />
                </figure>
              ))}
            </div>
          </div>

          <div className="relative z-[4] order-3 flex gap-3 lg:self-start lg:p-7 lg:pt-[68px]">
            <button type="button" onClick={prev} className={arrow} aria-label="Tela anterior">←</button>
            <button type="button" onClick={next} className={arrow} aria-label="Próxima tela">→</button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
