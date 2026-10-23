import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Em from '../components/ui/Em'
import Icon from '../components/ui/Icon'
import Spinner from '../components/ui/Spinner'
import useAuth from '../hooks/useAuth'
import useWikiSearch from '../hooks/useWikiSearch'

/** Página PÚBLICA que consome a API da Wikipédia (pt) em tempo real. */
export default function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const { user } = useAuth()
  const { results, loading, error, article, articleLoading, openArticle, closeArticle } = useWikiSearch(query)

  function onChange(e) {
    setQuery(e.target.value)
    setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })
  }

  return (
    <section className="grid-bg min-h-dvh pb-24 pt-32 lg:pt-40">
      <div className="mx-auto w-[min(1080px,calc(100%-32px))]">
        <p className="eyebrow">Explorar temas</p>
        <h1 className="max-w-[780px] text-[clamp(2.8rem,6vw,5.4rem)] font-semibold">
          Descubra o tema antes de <Em>estudar.</Em>
        </h1>
        <p className="mt-6 max-w-[560px] text-muted">
          Busque qualquer assunto na Wikipédia em português. Escolha um artigo e transforme-o em resumo e flashcards no CodeCam.
        </p>

        <div className="relative mt-10 max-w-[680px]" role="search">
          <label htmlFor="explore-q" className="sr-only">Buscar tema</label>
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <input
            id="explore-q"
            className="field !py-4 !pl-12 !text-base"
            placeholder="Ex.: Fotossíntese, Buraco negro, Revolução Francesa"
            value={query}
            onChange={onChange}
            autoFocus
          />
          {loading && <Spinner className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-violet-bright" />}
        </div>

        {error && <p role="alert" className="mt-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <ul className="grid content-start gap-3" aria-live="polite">
            {query.trim().length >= 3 && !loading && !results.length && !error && (
              <li className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">Nenhum resultado. Tente outro termo.</li>
            )}
            {results.map((r) => (
              <li key={r.pageId}>
                <button
                  type="button"
                  onClick={() => openArticle(r.title)}
                  className={`w-full rounded-2xl border p-5 text-left transition hover:border-violet-bright/60 ${
                    article?.title === r.title ? 'border-violet bg-violet/15' : 'border-line bg-surface'
                  }`}
                >
                  <h2 className="text-lg font-semibold tracking-tight">{r.title}</h2>
                  <p className="mt-1 line-clamp-2 text-[0.8rem] text-muted">{r.snippet}…</p>
                </button>
              </li>
            ))}
          </ul>

          <div>
            {articleLoading && (
              <div className="space-y-4 rounded-3xl border border-line bg-surface p-6">
                <div className="skeleton h-5 w-1/2" /><div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-5/6" /><div className="skeleton h-3 w-4/6" />
              </div>
            )}
            {article && !articleLoading && (
              <article className="animate-pop overflow-hidden rounded-3xl border border-violet/40 bg-surface">
                {article.thumbnail && <img src={article.thumbnail} alt={`Ilustração: ${article.title}`} className="h-52 w-full object-cover" />}
                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">{article.title}</h2>
                      {article.description && <p className="text-xs text-violet-bright">{article.description}</p>}
                    </div>
                    <button type="button" onClick={closeArticle} className="btn btn-ghost !min-h-8 !px-3 text-xs">Fechar</button>
                  </div>
                  <p className="text-sm leading-relaxed text-[#cfccd6]">{article.extract}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link to={`/gerar?tema=${encodeURIComponent(article.title)}`} className="btn btn-primary">
                      {user ? 'Gerar estudo' : 'Entrar e gerar estudo'} →
                    </Link>
                    {article.url && (
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                        Ler na Wikipédia <Icon name="external" className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )}
            {!article && !articleLoading && (
              <div className="grid min-h-[260px] place-items-center rounded-3xl border border-dashed border-line p-8 text-center text-sm text-muted">
                Selecione um resultado para ver o resumo do artigo.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
