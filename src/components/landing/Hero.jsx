import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Em from '../ui/Em'
import Phone from '../ui/Phone'

const TAGS = ['OCR inteligente', 'IA generativa', 'Acessibilidade']

export default function Hero() {
  const { user } = useAuth()

  return (
    <section id="inicio" className="grid-bg relative min-h-screen overflow-hidden pt-32 lg:pt-[152px]" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute -right-40 top-12 size-[700px] rounded-full bg-[radial-gradient(circle,rgba(109,86,246,.23),rgba(109,86,246,.06)_35%,transparent_68%)] blur-md" aria-hidden="true" />

      <div className="relative mx-auto grid w-[min(1180px,calc(100%-32px))] items-center gap-10 lg:min-h-[610px] lg:grid-cols-[.92fr_1.08fr]">
        <div className="relative z-10 pb-6">
          <p className="eyebrow">Inteligência que acompanha seu ritmo</p>
          <h1 id="hero-title" className="max-w-[680px] text-[clamp(3.6rem,9vw,7.6rem)] font-bold">
            Da lousa ao<br /><Em>aprendizado.</Em>
          </h1>
          <p className="mt-8 max-w-[515px] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.7] text-[#aaa7b2]">
            Uma foto transforma o conteúdo da aula em material de estudo claro, acessível e pronto para revisar.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link to={user ? '/gerar' : '/login'} className="btn btn-primary">
              {user ? 'Gerar meu resumo' : 'Testar o app'} <span aria-hidden="true">→</span>
            </Link>
            <Link to="/#como-funciona" className="border-b border-white/25 pb-1 text-[0.8rem] font-semibold text-[#c7c4cc] transition hover:border-white hover:text-white">
              Entenda como funciona ↓
            </Link>
          </div>
          <ul className="mt-9 flex flex-wrap gap-2" aria-label="Principais características">
            {TAGS.map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1.5 text-[0.64rem] uppercase tracking-wider text-[#85818c]">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto h-[470px] w-full max-w-[520px] sm:h-[570px]" aria-label="Demonstração visual do aplicativo">
          <div className="absolute right-0 top-14 size-[min(470px,90vw)] animate-orbit rounded-full border border-violet/20" aria-hidden="true" />
          <div className="absolute right-6 top-32 size-[min(340px,66vw)] rounded-full border border-violet/10" aria-hidden="true" />

          <Phone
            src="/assets/screens/summary-hq.webp"
            alt="Resumo gerado pelo CodeCam"
            className="absolute right-0 top-20 z-[2] h-[300px] w-[140px] rotate-[11deg] brightness-75 sm:h-[424px] sm:w-[196px]"
          />
          <Phone
            src="/assets/screens/capture-hq.webp"
            alt="Tela do CodeCam fotografando uma lousa sobre fotossíntese"
            className="absolute right-[90px] top-10 z-[3] h-[360px] w-[170px] rotate-3 sm:right-[108px] sm:h-[487px] sm:w-[225px]"
          />
        </div>
      </div>

      <div className="relative z-[4] mx-auto mt-6 grid w-[min(1180px,calc(100%-32px))] grid-cols-2 items-center gap-6 border-t border-line py-8 lg:grid-cols-[repeat(3,.65fr)_1.55fr]">
        {[
          ['01', <>Menos tempo<br />transcrevendo</>],
          ['02', <>Mais foco<br />aprendendo</>],
          ['03', <>Conteúdo<br />organizado</>],
        ].map(([n, text]) => (
          <p key={n} className="flex items-center gap-3">
            <strong className="text-xs text-violet">{n}</strong>
            <span className="text-[0.7rem] leading-snug text-[#85818d]">{text}</span>
          </p>
        ))}
        <p className="col-span-2 text-[0.96rem] leading-snug text-[#d3d0d8] lg:col-span-1 lg:text-right">
          Seu material de estudo começa<br /><Em className="text-lg">antes mesmo de a aula terminar.</Em>
        </p>
      </div>
    </section>
  )
}
