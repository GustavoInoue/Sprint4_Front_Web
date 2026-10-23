import useAccessibility from '../../hooks/useAccessibility'
import Phone from '../ui/Phone'
import Reveal from '../ui/Reveal'

const TAGS = ['Baixa visão', 'Deficiência visual', 'Dislexia', 'Dificuldade motora']

export default function AccessibilitySection() {
  const { settings, toggleContrast, toggleDyslexia, setSize } = useAccessibility()

  return (
    <section className="overflow-hidden bg-violet py-24 lg:py-36" aria-labelledby="accessibility-title">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow !text-lavender">Acessibilidade desde o início</p>
          <h2 id="accessibility-title" className="text-[clamp(3rem,5.6vw,5.6rem)] font-semibold">
            Tecnologia que se adapta às pessoas. <em className="font-serif font-normal italic text-white">Não o contrário.</em>
          </h2>
          <p className="my-7 max-w-[520px] text-white/75">
            Recursos de personalização ajudam diferentes estudantes a acessar o conteúdo com mais conforto, legibilidade e
            independência. <strong className="text-white">Teste ao lado — os ajustes valem para o site inteiro.</strong>
          </p>
          <ul className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <li key={t} className="rounded-full border border-white/30 px-3 py-2 text-[0.65rem]">{t}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100} className="relative mx-auto min-h-[560px] w-full max-w-[650px]">
          <Phone
            src="/assets/screens/accessibility-hq.webp"
            alt="Tela de ajustes de acessibilidade do CodeCam"
            className="absolute left-2 top-1/2 z-[2] h-[430px] w-[199px] -translate-y-1/2 -rotate-[5deg] bg-[#0b0b0f] sm:left-9 sm:h-[524px] sm:w-[242px]"
            imgClassName="!object-contain"
          />
          <div className="absolute right-0 top-1/2 z-[3] w-[min(330px,66%)] -translate-y-[42%] rounded-[25px] border border-white/15 bg-[#0d0c14]/90 p-6 shadow-phone backdrop-blur-xl">
            <div className="flex min-h-14 items-center justify-between text-[0.72rem]">
              <span>Contraste</span>
              <button
                type="button"
                onClick={toggleContrast}
                aria-pressed={settings.contrast}
                className={`rounded-md px-2.5 py-1.5 text-[0.58rem] font-bold ${settings.contrast ? 'bg-lime text-ink' : 'bg-violet'}`}
              >
                {settings.contrast ? 'ALTO' : 'NORMAL'}
              </button>
            </div>
            <div className="flex min-h-14 items-center justify-between gap-3 text-[0.72rem]">
              <span>Tamanho do texto</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-label={`Tamanho ${s + 1}`}
                    aria-pressed={settings.size === s}
                    className={`grid size-7 place-items-center rounded-md font-bold ${settings.size === s ? 'bg-white text-ink' : 'bg-white/10'}`}
                    style={{ fontSize: `${0.65 + s * 0.15}rem` }}
                  >
                    A
                  </button>
                ))}
              </div>
            </div>
            <div className="flex min-h-14 items-center justify-between text-[0.72rem]">
              <span>Fonte para dislexia</span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.dyslexia}
                aria-label="Fonte para dislexia"
                onClick={toggleDyslexia}
                className={`relative h-5 w-9 rounded-full transition ${settings.dyslexia ? 'bg-violet-bright' : 'bg-[#383641]'}`}
              >
                <span className={`absolute top-[3px] size-3.5 rounded-full bg-white transition-all ${settings.dyslexia ? 'left-[19px]' : 'left-[3px]'}`} />
              </button>
            </div>
            <blockquote className="mt-6 font-serif text-base italic leading-normal text-[#a9a5b0]">
              “Acessibilidade não é uma camada extra. É parte da experiência.”
            </blockquote>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
