import Em from '../ui/Em'
import Icon from '../ui/Icon'
import Reveal from '../ui/Reveal'

const card = 'flex flex-col rounded-3xl border border-line bg-surface p-7 transition hover:duration-300 hover:-translate-y-1.5 hover:border-violet-bright/50'
const head = 'flex justify-between text-[0.63rem] tracking-[0.12em] text-[#76727f]'
const icon = 'my-auto mb-0 grid size-[55px] place-items-center rounded-[15px] bg-violet/15 text-violet-bright'

export default function Formats() {
  return (
    <section className="bg-ink-soft py-24 lg:py-36" aria-labelledby="formats-title">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] items-start gap-14 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32">
          <p className="eyebrow">Conteúdo adaptável</p>
          <h2 id="formats-title" className="text-[clamp(3rem,5.6vw,5.6rem)] font-semibold">
            Uma aula.<br /><Em>Três jeitos</Em><br />de absorver.
          </h2>
          <p className="mt-8 max-w-[370px] text-[0.9rem] text-muted">
            Cada conteúdo pode assumir o formato que melhor acompanha o momento do estudante — compreender, consultar ou praticar.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal as="article" className={`${card} min-h-[380px]`}>
            <header className={head}><span>01</span><small>COMPREENDER</small></header>
            <div className={`${icon} mt-12 text-2xl`} aria-hidden="true">≡</div>
            <h3 className="mb-2.5 mt-5 text-[2rem]">Resumos</h3>
            <p className="max-w-[400px] text-[0.78rem] text-[#8f8b97]">Uma visão clara e estruturada dos conceitos essenciais para ganhar contexto rapidamente.</p>
            <div className="mt-6 grid gap-1.5" aria-hidden="true">
              {['100%', '78%', '90%', '62%'].map((w) => <i key={w} style={{ width: w }} className="h-1 rounded bg-[#292833]" />)}
            </div>
          </Reveal>

          <Reveal as="article" delay={90} className={`${card} min-h-[380px]`}>
            <header className={head}><span>02</span><small>CONSULTAR</small></header>
            <div className={`${icon} mt-12 text-2xl`} aria-hidden="true">☷</div>
            <h3 className="mb-2.5 mt-5 text-[2rem]">Tópicos</h3>
            <p className="max-w-[400px] text-[0.78rem] text-[#8f8b97]">Pontos-chave organizados para uma leitura objetiva antes de provas e atividades.</p>
            <ul className="mt-6 grid gap-2" aria-hidden="true">
              {[1, 2, 3].map((k) => <li key={k} className="h-[9px] border-l-[3px] border-violet bg-[#24232d]" />)}
            </ul>
          </Reveal>

          <Reveal
            as="article"
            delay={140}
            className={`${card} min-h-[340px] gap-8 bg-linear-to-br from-[#32216b] to-[#1a1630] sm:col-span-2 md:grid md:grid-cols-2 md:items-center`}
          >
            <div className="flex h-full flex-col">
              <header className={head}><span>03</span><small>PRATICAR</small></header>
              <div className={`${icon} mt-9`} aria-hidden="true"><Icon name="layers" className="size-7" /></div>
              <h3 className="mb-2.5 mt-5 text-[2rem]">Flashcards</h3>
              <p className="max-w-[400px] text-[0.78rem] text-[#a39fb0]">Perguntas e respostas que tornam a revisão ativa e ajudam na memorização.</p>
            </div>
            <div className="mt-6 flex min-h-[150px] flex-col justify-between rounded-[18px] border border-white/15 bg-ink/25 p-5 md:mt-0" aria-hidden="true">
              <small className="text-[0.58rem] tracking-[0.1em] text-lavender">PERGUNTA</small>
              <strong className="text-lg">O que você aprendeu?</strong>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
