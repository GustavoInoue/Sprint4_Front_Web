import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'
import useScrollStory from '../../hooks/useScrollStory'
import Em from '../ui/Em'
import Reveal from '../ui/Reveal'

const SLIDES = [
  { key: 'home', tag: 'INÍCIO', title: 'Início', sub: 'Visão rápida da rotina', msg: 'Uma visão clara para acompanhar sua rotina de estudos.', alt: 'Tela inicial do CodeCam' },
  { key: 'capture', tag: 'CAPTURA', title: 'Captura', sub: 'Conteúdo em um clique', msg: 'Registre o conteúdo da aula em um único gesto.', alt: 'Tela de captura da lousa pelo CodeCam' },
  { key: 'summary', tag: 'RESUMO', title: 'Resumo', sub: 'Compreensão sem ruído', msg: 'A inteligência transforma a imagem em compreensão.', alt: 'Resumo criado por inteligência artificial' },
  { key: 'flashcards', tag: 'FLASHCARDS', title: 'Flashcards', sub: 'Revisão que envolve', msg: 'Revise de forma ativa e memorize melhor.', alt: 'Flashcards de revisão no CodeCam' },
  { key: 'folders', tag: 'PASTAS', title: 'Pastas', sub: 'Tudo no lugar certo', msg: 'Organize cada matéria no lugar certo.', alt: 'Pastas de matérias no CodeCam' },
]

// Quanto de rolagem cada troca de tela "custa" (em % da altura da janela).
const SCROLL_PER_STEP = 70

export default function Gallery() {
  const reduced = usePrefersReducedMotion()
  const { trackRef, stageRef, index, goTo } = useScrollStory(SLIDES.length, { reduced })
  const active = SLIDES[index]
  const last = SLIDES.length - 1

  return (
    <section id="galeria" className="scroll-mt-20 bg-ink pb-16 pt-24 lg:pb-24 lg:pt-36" aria-labelledby="gallery-title">
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
      </div>

      {/* Pista alta: a rolagem por ela avança as telas. O palco fica fixo enquanto isso. */}
      <div ref={trackRef} style={{ height: `${100 + (SLIDES.length - 1) * SCROLL_PER_STEP}dvh` }}>
        <div ref={stageRef} className="sticky top-0 flex h-dvh items-center pb-6 pt-24 lg:pb-10">
          <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
            <Reveal
              className="relative grid items-center gap-4 overflow-clip rounded-[30px] border border-line bg-linear-to-br from-[#12121a] via-[#1a1730] to-[#0d0d12] px-5 py-6 lg:min-h-[560px] lg:grid-cols-[.72fr_1.4fr_.72fr] lg:gap-6 lg:px-0 lg:py-0"
              role="region"
              aria-roledescription="carrossel"
              aria-label="Principais telas do CodeCam"
            >
              <div className="relative z-[4] order-2 lg:order-1 lg:self-end lg:p-7 lg:pb-[60px]" aria-live="polite">
                <span className="block text-[0.61rem] font-extrabold tracking-[0.14em] text-violet-bright">{active.tag}</span>
                <p key={active.key} className="mt-3 max-w-[260px] animate-pop text-[0.9rem] leading-[1.6] text-[#b0acb8] lg:mt-4 lg:max-w-[220px] lg:leading-[1.7]">{active.msg}</p>
                <div className="mt-5 flex items-center gap-1.5 lg:mt-7" role="tablist" aria-label="Escolher tela">
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.key}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Ir para ${s.title}`}
                      onClick={() => goTo(i)}
                      className="group grid h-6 place-items-center"
                    >
                      <span className={`block h-[3px] rounded transition-all ${i === index ? 'w-9 bg-violet-bright' : 'w-[22px] bg-[#373440] group-hover:bg-[#55515f]'}`} />
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[0.62rem] uppercase tracking-[0.16em] text-[#6a6672]" aria-hidden="true">
                  {index < last ? 'Role para ver as telas ↓' : 'Continue rolando ↓'}
                </p>
              </div>

              <div className="relative order-1 grid place-items-center py-1 lg:order-2 lg:min-h-[560px] lg:py-0">
                <div className="absolute size-[min(370px,80vw)] rounded-full bg-[radial-gradient(circle,rgba(109,86,246,.44),rgba(109,86,246,.09)_48%,transparent_70%)]" aria-hidden="true" />
                {/* O celular inclina de leve conforme a rolagem; as telas deslizam como numa lista vertical. */}
                <div
                  className="relative z-[2] aspect-[222/478] h-[clamp(250px,42dvh,440px)] overflow-hidden rounded-[30px] border-8 border-[#292832] bg-ink shadow-[0_34px_76px_rgba(0,0,0,.7),0_0_68px_rgba(109,86,246,.24)] lg:h-[clamp(380px,60dvh,500px)]"
                  style={reduced ? { rotate: '3deg' } : { rotate: 'calc(4deg - var(--p, 0) * 8deg)' }}
                >
                  <span className="absolute left-1/2 top-2 z-[5] h-[15px] w-[62px] -translate-x-1/2 rounded-b-[13px] bg-ink" aria-hidden="true" />
                  {SLIDES.map((s, i) => (
                    <figure
                      key={s.key}
                      aria-hidden={i !== index}
                      className={`absolute inset-0 ${reduced ? `transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}` : 'will-change-transform'}`}
                      style={reduced ? undefined : { transform: `translateY(calc((${i} - var(--pos, 0)) * 100%))` }}
                    >
                      <img src={`/assets/screens/gallery-${s.key}-hq.webp`} alt={s.alt} loading="lazy" className="h-full w-full object-cover" />
                    </figure>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
