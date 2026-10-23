import { useEffect, useState } from 'react'
import { getArticleSummary, searchArticles } from '../services/wikipedia'
import useDebounce from './useDebounce'

/** Busca na Wikipédia (com debounce) + carregamento do artigo selecionado. */
export default function useWikiSearch(query) {
  const debounced = useDebounce(query.trim(), 450)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [article, setArticle] = useState(null)
  const [articleLoading, setArticleLoading] = useState(false)

  useEffect(() => {
    if (debounced.length < 3) {
      setResults([])
      setError('')
      return undefined
    }
    const controller = new AbortController()
    setLoading(true)
    setError('')
    searchArticles(debounced, { signal: controller.signal })
      .then(setResults)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [debounced])

  async function openArticle(title) {
    setArticleLoading(true)
    setError('')
    try {
      setArticle(await getArticleSummary(title))
    } catch (err) {
      setError(err.message)
    } finally {
      setArticleLoading(false)
    }
  }

  return { results, loading, error, article, articleLoading, openArticle, closeArticle: () => setArticle(null) }
}
