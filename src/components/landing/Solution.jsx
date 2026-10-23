import Em from '../ui/Em'
import Phone from '../ui/Phone'
import Reveal from '../ui/Reveal'

const FEATURES = ['Integração com a câmera nativa', 'Reconhecimento óptico de caracteres', 'Validação da qualidade da imagem']
const corner = 'absolute size-9 border-lavender'

export default function Solution() {
  return (
    <section id="solucao" className="scroll-mt-20 bg-ink py-24 lg:py-36" aria-labelledby="solution-title">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <Reveal className="mb-16 grid gap-6 lg:mb-20 lg:grid-cols-[1.08fr_.72fr] lg:items-end lg:gap-20">
          <div>
            <p className="eyebrow">A solução</p>
            <h2 id="solution-title" className="max-w-[760px] text-[clamp(3rem,5.7vw,5.7rem)] font-semibold">
              Uma câmera.<br />Novas formas de <Em>aprender.</Em>
            </h2>
          </div>
          <p className="max-w-[380px] text-[0.9rem] leading-[1.8] text-muted">
            O CodeCam conecta a câmera nativa do celular à inteligência artificial para interpretar o conteúdo visual da
            aula e convertê-lo em materiais úteis, personalizados e acessíveis.
          </p>
        </Reveal>

        <Reveal className="grid overflow-hidden rounded-[36px] border border-line bg-surface lg:min-h-[680px] lg:grid-cols-[.8fr_1.2fr]">
          <article className="flex flex-col justify-center p-8 sm:p-14 lg:p-[76px]">
            <span className="mb-8 text-[0.63rem] font-extrabold tracking-[0.13em] text-violet-bright">CAPTURA INTELIGENTE</span>
            <h3 className="text-[clamp(2.1rem,3.6vw,3.65rem)]">Aponte. Fotografe.<br />O resto ganha contexto.</h3>
            <p className="my-7 text-[0.9rem] leading-[1.85] text-[#97939f]">
              O aplicativo identifica textos e estruturas presentes na lousa. Antes do processamento, o estudante revisa a
              imagem para garantir uma leitura de qualidade.
            </p>
            <ul className="grid gap-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex gap-2.5 text-[0.76rem] text-[#bbb8c1]">
                  <span className="text-violet-bright">✓</span> {f}
                </li>
              ))}
            </ul>
          </article>

          <div className="relative min-h-[560px] overflow-hidden bg-[radial-gradient(circle_at_48%_45%,rgba(109,86,246,.4),transparent_38%),linear-gradient(135deg,#201947,#0d0d14_70%)]">
            <Phone
              src="/assets/screens/capture-hq.webp"
              alt="Câmera do CodeCam capturando o conteúdo da lousa"
              className="absolute left-1/2 top-[55%] z-[2] h-[430px] w-[199px] -translate-x-1/2 -translate-y-1/2 -rotate-[4deg] sm:h-[574px] sm:w-[265px]"
            />
            <div className="absolute left-1/2 top-[49%] z-[4] h-[260px] w-[min(330px,80%)] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
              <i className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
              <i className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
              <i className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
              <i className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
            </div>
            <p className="absolute right-8 top-8 z-[4] flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.08em] text-[#c7c3d0]">
              <span className="size-[7px] animate-pulse rounded-full bg-lime shadow-[0_0_12px_#c9ff75]" /> Analisando conteúdo visual
            </p>
            <div className="absolute bottom-8 left-8 z-[4]">
              <strong className="block text-[0.84rem] tracking-[0.12em]">FOTOSSÍNTESE</strong>
              <span className="text-[0.63rem] text-[#777381]">Texto detectado</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
