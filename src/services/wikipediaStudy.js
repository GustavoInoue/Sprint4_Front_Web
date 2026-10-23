import { findBestArticle } from './wikipedia'
import { shuffle } from '../utils/math'

// Gera resumo e flashcards a partir do texto de um artigo da Wikipédia (pt).
// Não usa nenhuma IA externa: tudo vem da API pública da Wikipédia.

const STOPWORDS = new Set([
  'porque', 'quando', 'sendo', 'assim', 'também', 'entre', 'ainda', 'depois', 'antes',
  'sobre', 'contra', 'desde', 'todos', 'todas', 'outros', 'outras', 'muito', 'muitos',
  'esse', 'essa', 'esses', 'essas', 'aquele', 'aquela', 'mesmo', 'mesma', 'durante',
  'através', 'segundo', 'ainda', 'onde', 'qual', 'quais', 'cada', 'pelo', 'pela',
])

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && s.length < 320)
}

function pickKeyword(sentence, title) {
  const titleWords = title.toLowerCase().split(/\s+/)
  const words = sentence
    .replace(/[(),;:"“”]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 6)
    .filter((w) => !STOPWORDS.has(w.toLowerCase()))
    .filter((w) => !titleWords.includes(w.toLowerCase()))
  if (!words.length) return null
  return words.sort((a, b) => b.length - a.length)[0].replace(/[.!?]$/, '')
}

export function buildSummary(article) {
  const sentences = splitSentences(article.extract)
  const intro = sentences.slice(0, 2).join(' ') || article.extract
  const rest = sentences.slice(2)
  const headings = ['Ideias centrais', 'Desenvolvimento', 'Pontos de atenção']
  const size = Math.max(1, Math.ceil(rest.length / 3))
  const topics = headings
    .map((heading, i) => ({
      heading,
      content: rest.slice(i * size, (i + 1) * size).join(' '),
    }))
    .filter((t) => t.content)

  if (!topics.length) {
    topics.push({ heading: 'Visão geral', content: article.description || intro })
  }
  return {
    title: article.title,
    introduction: intro,
    topics,
    conclusion: article.description
      ? `Em uma frase: ${article.title} — ${article.description}.`
      : '',
    sourceUrl: article.url,
  }
}

export function buildFlashcards(article, count = 4) {
  const cards = []
  if (article.description || article.extract) {
    cards.push({
      question: `O que é ${article.title}?`,
      answer: article.description || splitSentences(article.extract)[0] || article.extract,
    })
  }
  // Usa o artigo completo (sem títulos de seção "== ... ==") para ter frases suficientes.
  const source = (article.fullText || article.extract || '').replace(/^=+.*?=+$/gm, ' ')
  const pool = [...new Set(splitSentences(source))]
  for (const sentence of shuffle(pool)) {
    if (cards.length >= count) break
    const keyword = pickKeyword(sentence, article.title)
    if (!keyword) continue
    cards.push({
      question: `Complete a lacuna: ${sentence.replace(keyword, '_____')}`,
      answer: keyword,
    })
  }
  return cards.length ? cards : [{ question: `Fale sobre ${article.title}.`, answer: article.extract }]
}

// Cache simples: pedir resumo + flashcards do mesmo tema faz só 1 busca.
const articleCache = new Map()

function getArticle(topic) {
  const key = topic.trim().toLowerCase()
  if (!articleCache.has(key)) {
    const promise = findBestArticle(topic).catch((err) => {
      articleCache.delete(key)
      throw err
    })
    articleCache.set(key, promise)
  }
  return articleCache.get(key)
}

/** @returns {Promise<{data: object, source: 'wikipedia'}>} */
export async function generateSummary(topic) {
  return { data: buildSummary(await getArticle(topic)), source: 'wikipedia' }
}

/** @returns {Promise<{data: Array<{question: string, answer: string}>, source: 'wikipedia'}>} */
export async function generateFlashcards(topic, count = 4) {
  return { data: buildFlashcards(await getArticle(topic), count), source: 'wikipedia' }
}
