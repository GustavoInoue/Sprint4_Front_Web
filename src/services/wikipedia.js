// API pública da Wikipédia (pt) — sem chave, com CORS liberado.
const SEARCH_URL = 'https://pt.wikipedia.org/w/api.php'
const SUMMARY_URL = 'https://pt.wikipedia.org/api/rest_v1/page/summary/'

function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
}

export async function searchArticles(query, { signal, limit = 6 } = {}) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    srlimit: String(limit),
    srprop: 'snippet',
    format: 'json',
    origin: '*',
  })
  const res = await fetch(`${SEARCH_URL}?${params}`, { signal })
  if (!res.ok) throw new Error('Não foi possível consultar a Wikipédia agora.')
  const json = await res.json()
  return (json?.query?.search ?? []).map((item) => ({
    pageId: item.pageid,
    title: item.title,
    snippet: stripHtml(item.snippet),
  }))
}

export async function getArticleSummary(title, { signal } = {}) {
  const res = await fetch(`${SUMMARY_URL}${encodeURIComponent(title.replace(/ /g, '_'))}`, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error('Artigo não encontrado na Wikipédia.')
  const json = await res.json()
  return {
    title: json.title,
    description: json.description ?? '',
    extract: json.extract ?? '',
    thumbnail: json.thumbnail?.source ?? null,
    url: json.content_urls?.desktop?.page ?? null,
  }
}

/** Texto completo do artigo (sem HTML), usado para gerar mais flashcards. */
export async function getArticleFullText(title, { signal } = {}) {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    explaintext: '1',
    exsectionformat: 'wiki',
    redirects: '1',
    titles: title,
    format: 'json',
    origin: '*',
  })
  const res = await fetch(`${SEARCH_URL}?${params}`, { signal })
  if (!res.ok) throw new Error('Não foi possível consultar a Wikipédia agora.')
  const json = await res.json()
  const page = Object.values(json?.query?.pages ?? {})[0]
  return page?.extract ?? ''
}

/** Busca o melhor artigo para um tema livre. */
export async function findBestArticle(topic, { signal } = {}) {
  const results = await searchArticles(topic, { signal, limit: 1 })
  if (!results.length) throw new Error('Não encontramos material sobre esse tema.')
  const article = await getArticleSummary(results[0].title, { signal })
  // O texto completo é opcional: se falhar, usamos só o resumo.
  const fullText = await getArticleFullText(results[0].title, { signal }).catch(() => '')
  return { ...article, fullText }
}
