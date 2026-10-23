import Em from '../ui/Em'
import Reveal from '../ui/Reveal'

const MEMBERS = [
  { photo: 'team-design', role: 'Design & experiência', name: 'Gustavo Inoue', title: 'UX/UI Designer', alt: 'Integrante responsável por Design e Experiência' },
  { photo: 'team-tech', role: 'Tecnologia', name: 'Lívia Laur', title: 'Desenvolvimento', alt: 'Integrante responsável por Tecnologia e Desenvolvimento' },
  { photo: 'team-ai', role: 'Inteligência', name: 'Rafael Dias', title: 'IA & Produto', alt: 'Integrante responsável por IA e Produto' },
  { photo: 'team-six', role: 'Estratégia', name: 'Luca Baccari', title: 'Pesquisa & Conteúdo', alt: 'Integrante responsável por Pesquisa e Conteúdo' },
  { photo: 'team-product', role: 'Produto', name: 'Lara Beatriz', title: 'Gestão & Validação', alt: 'Integrante responsável por Gestão e Validação' },
]

export default function Team() {
  return (
    <section id="equipe" className="scroll-mt-20 bg-paper py-24 text-ink lg:py-36" aria-labelledby="team-title">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <Reveal className="mb-16 max-w-[810px]">
          <p className="eyebrow">Nossa equipe</p>
          <h2 id="team-title" className="text-[clamp(3rem,5.6vw,5.6rem)] font-semibold">
            Ideias diferentes.<br /><Em>Um propósito em comum.</Em>
          </h2>
          <p className="mt-7 max-w-[520px] text-[#6f6b72]">
            Uma equipe multidisciplinar dedicada a criar uma experiência de estudo mais inteligente, humana e inclusiva.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-3.5 gap-y-9 md:grid-cols-3 lg:grid-cols-5">
          {MEMBERS.map((m, i) => (
            <Reveal as="article" key={m.name} delay={i * 80} className="grid content-start gap-5">
              <div className="group relative aspect-[.82] overflow-hidden rounded-3xl bg-[#ddd9d1]">
                <img src={`/assets/${m.photo}.webp`} alt={m.alt} loading="lazy" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-2 py-0.5 text-[0.62rem] text-white backdrop-blur">0{i + 1}</span>
              </div>
              <div className="px-1.5">
                <p className="text-[0.6rem] font-extrabold uppercase tracking-widest text-violet">{m.role}</p>
                <h3 className="my-2 text-xl">{m.name}</h3>
                <small className="text-[0.75rem] text-[#79757c]">{m.title}</small>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
