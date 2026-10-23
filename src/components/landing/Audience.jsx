import Em from '../ui/Em'
import Reveal from '../ui/Reveal'

const BENEFITS = [
  ['+ foco', 'na compreensão'],
  ['− atrito', 'na organização'],
  ['+ autonomia', 'para revisar'],
  ['+ inclusão', 'na experiência'],
]

export default function Audience() {
  return (
    <section id="publico" className="scroll-mt-20 overflow-clip bg-paper py-24 text-ink lg:py-36" aria-labelledby="audience-title">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <Reveal className="relative grid min-h-[520px] place-items-center lg:min-h-[630px]">
          <span className="absolute size-[min(500px,90vw)] rounded-full bg-violet" aria-hidden="true" />
          <span className="drift d-md pointer-events-none absolute left-0 top-0 select-none text-[clamp(7rem,17vw,14rem)] font-black leading-[.8] tracking-[-0.1em] text-transparent [-webkit-text-stroke:1px_rgba(9,9,13,.14)]" aria-hidden="true">
            FULL
          </span>
          <span className="drift drift-up d-md pointer-events-none absolute bottom-0 left-[18%] select-none text-[clamp(7rem,17vw,14rem)] font-black leading-[.8] tracking-[-0.1em] text-paper/50" aria-hidden="true">
            TIME
          </span>
          <div className="relative z-[2] w-[min(370px,84%)] -rotate-[4deg] rounded-[36px] bg-ink/95 p-9 text-white shadow-[0_40px_80px_rgba(27,16,70,.28)] sm:p-10">
            <p className="text-[0.6rem] font-extrabold tracking-[0.14em] text-lavender">PERSONA PRINCIPAL</p>
            <h3 className="mb-12 mt-6 text-5xl">Estudante<br /><Em>fulltime</Em></h3>
            <dl>
              {[['Rotina', 'Intensa'], ['Objetivo', 'Aprender melhor'], ['Necessidade', 'Organização']].map(([k, v]) => (
                <div key={k} className="flex justify-between border-t border-line py-3 text-[0.73rem]">
                  <dt className="text-[#77737f]">{k}</dt>
                  <dd className="font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="eyebrow">Público-alvo</p>
          <h2 id="audience-title" className="text-[clamp(2.8rem,5.2vw,5.2rem)] font-semibold">
            Para quem estuda o dia inteiro e precisa fazer <Em>cada hora valer.</Em>
          </h2>
          <p className="my-8 text-[0.93rem] leading-[1.9] text-[#68656c]">
            O CodeCam foi pensado para estudantes que equilibram aulas, trabalhos, provas e revisões em uma rotina intensa.
            Pessoas que precisam capturar informações com agilidade sem abrir mão da qualidade do aprendizado.
          </p>
          <div className="grid grid-cols-2 overflow-hidden rounded-[22px] border border-violet/30 bg-white/40">
            {BENEFITS.map(([t, s]) => (
              <article key={t} className="border-b border-r border-violet/20 p-5 transition hover:bg-violet/10">
                <strong className="block text-lg text-violet">{t}</strong>
                <span className="text-[0.7rem] text-[#79757c]">{s}</span>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
