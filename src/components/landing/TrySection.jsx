import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Em from '../ui/Em'
import Reveal from '../ui/Reveal'

const SUGGESTIONS = ['Fotossíntese', 'Revolução Industrial', 'Buracos negros', 'Sistema Solar', 'Mitocôndria', 'Inflação']

export default function TrySection() {
  const [topic, setTopic] = useState('')
  const navigate = useNavigate()

  function go(value) {
    const q = value.trim()
    navigate(q ? `/explorar?q=${encodeURIComponent(q)}` : '/explorar')
  }

  return (
    <section className="overflow-hidden bg-ink-soft py-20 lg:py-28" aria-labelledby="try-title">
      <Reveal className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <div className="relative overflow-hidden rounded-[36px] border border-line bg-surface p-8 sm:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 size-[380px] rounded-full bg-violet/25 blur-3xl" aria-hidden="true" />
          <p className="eyebrow">Experimente agora — sem câmera</p>
          <h2 id="try-title" className="max-w-[760px] text-[clamp(2.4rem,4.6vw,4.4rem)] font-semibold">
            Digite um tema e veja o CodeCam <Em>entrar em ação.</Em>
          </h2>
          <form
            onSubmit={(e) => { e.preventDefault(); go(topic) }}
            className="relative mt-9 flex max-w-[640px] flex-col gap-3 sm:flex-row"
            role="search"
          >
            <label htmlFor="try-topic" className="sr-only">Tema para explorar</label>
            <input
              id="try-topic"
              className="field flex-1"
              placeholder="Ex.: Fotossíntese, Revolução Francesa..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Explorar tema →</button>
          </form>
          <ul className="relative mt-6 flex flex-wrap gap-2" aria-label="Sugestões de temas">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => go(s)} className="rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition hover:border-violet-bright hover:text-white">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
