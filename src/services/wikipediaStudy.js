import { findBestArticle, searchArticles, getArticleFullText } from './wikipedia'
import { shuffle } from '../utils/math'

// Gera resumo e flashcards a partir do texto de um artigo da Wikipédia (pt).
// Não usa nenhuma IA externa: tudo vem da API pública da Wikipédia.

const STOPWORDS = new Set([
  'porque', 'quando', 'sendo', 'assim', 'também', 'entre', 'ainda', 'depois', 'antes',
  'sobre', 'contra', 'desde', 'todos', 'todas', 'outros', 'outras', 'muito', 'muitos',
  'esse', 'essa', 'esses', 'essas', 'aquele', 'aquela', 'mesmo', 'mesma', 'durante',
  'através', 'segundo', 'ainda', 'onde', 'qual', 'quais', 'cada', 'pelo', 'pela',
])

function splitSentences(text, minLength = 40) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/)
    .map((s) => s.trim())
    .filter((s) => s.length > minLength && s.length < 320)
}

/** Palavras candidatas a lacuna, da mais longa para a mais curta. */
function candidateKeywords(sentence, title, minLength) {
  const titleWords = title.toLowerCase().split(/\s+/)
  const seen = new Set()
  return sentence
    .replace(/[(),;:"“”]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/[.!?]+$/, ''))
    .filter((w) => w.length >= minLength && /^\p{L}+$/u.test(w))
    .filter((w) => !STOPWORDS.has(w.toLowerCase()) && !titleWords.includes(w.toLowerCase()))
    .filter((w) => {
      const key = w.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => b.length - a.length)
}

function blank(sentence, keyword) {
  return sentence.replace(new RegExp(`(?<!\\p{L})${keyword}(?!\\p{L})`, 'u'), '_____')
}

// Seções da Wikipédia que não ajudam em um resumo de estudo.
const SKIP_SECTIONS =
  /^(refer[êe]ncias?|ver tamb[ée]m|liga[çc][õo]es? externas?|links? externos?|notas?|bibliografia|leitura (adicional|complementar)|fontes?|galeria|ficheiros? multim[ée]dia)$/i

const MAX_TOPICS = 8
const SENTENCES_PER_TOPIC = 5
const MAX_TOPIC_CHARS = 900

/** Divide o texto do artigo em { lead, sections: [{ heading, body }] } usando "== Título ==". */
function parseSections(fullText) {
  const text = (fullText || '').replace(/\r/g, '')
  const re = /^(={2,6})\s*(.+?)\s*\1\s*$/gm
  const marks = [...text.matchAll(re)]
  if (!marks.length) return { lead: text, sections: [] }

  const lead = text.slice(0, marks[0].index)
  const sections = []
  marks.forEach((m, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].index : text.length
    const body = text.slice(m.index + m[0].length, end)
    if (m[1].length === 2) {
      sections.push({ heading: m[2].trim(), body })
    } else if (sections.length) {
      // Subseção: o conteúdo é somado à seção principal.
      sections[sections.length - 1].body += ` ${body}`
    }
  })
  return { lead, sections }
}

function takeSentences(sentences, maxSentences = SENTENCES_PER_TOPIC, maxChars = MAX_TOPIC_CHARS) {
  const out = []
  let length = 0
  for (const s of sentences) {
    if (out.length >= maxSentences || (out.length && length + s.length > maxChars)) break
    out.push(s)
    length += s.length + 1
  }
  return out.join(' ')
}

export function buildSummary(article) {
  const { lead, sections } = parseSections(article.fullText)
  const leadSentences = splitSentences(lead || article.extract, 30)
  const intro = takeSentences(leadSentences, 4, 1000) || article.extract

  // Um tópico por seção real do artigo (história, aplicações, etc.).
  let topics = sections
    .filter((s) => !SKIP_SECTIONS.test(s.heading))
    .map((s) => ({ heading: s.heading, content: takeSentences(splitSentences(s.body, 30)) }))
    .filter((t) => t.content)
    .slice(0, MAX_TOPICS)

  // Artigo sem seções: divide as frases em blocos, como antes, mas com mais conteúdo.
  if (topics.length < 3) {
    const all = splitSentences(article.fullText || article.extract || '', 30)
    const rest = all.filter((s) => !intro.includes(s))
    const headings = ['Ideias centrais', 'Desenvolvimento', 'Detalhes', 'Pontos de atenção']
    const size = Math.max(1, Math.ceil(rest.length / headings.length))
    const fallback = headings
      .map((heading, i) => ({
        heading,
        content: takeSentences(rest.slice(i * size, (i + 1) * size)),
      }))
      .filter((t) => t.content)
    if (fallback.length > topics.length) topics = fallback
  }

  if (!topics.length) {
    topics.push({ heading: 'Visão geral', content: article.description || intro })
  }

  const covered = topics.map((t) => t.heading).join(', ')
  const oneLine = article.description ? `Em uma frase: ${article.title} — ${article.description}.` : ''
  return {
    title: article.title,
    introduction: intro,
    topics,
    conclusion: [oneLine, topics.length > 1 ? `Este resumo cobre: ${covered}.` : '']
      .filter(Boolean)
      .join(' '),
    sourceUrl: article.url,
  }
}

/**
 * Monta exatamente `count` flashcards (quando há material suficiente).
 * Vai do tipo mais fácil de gerar bem para o mais flexível, até completar:
 *  1. lacuna com a palavra mais longa de cada frase
 *  2. lacuna com a 2ª palavra de cada frase
 *  3. lacunas com frases/palavras mais curtas
 *  4. pergunta aberta sobre o início da frase
 *  5. verdadeiro ou falso
 */
export function buildFlashcards(article, count = 4) {
  const target = Math.max(1, Number(count) || 1)
  const cards = []
  const used = new Set()

  function add(card) {
    if (cards.length >= target || used.has(card.question)) return
    used.add(card.question)
    cards.push(card)
  }

  const text = [article.fullText || article.extract, article.relatedText]
    .filter(Boolean)
    .join(' ')
    .replace(/^=+.*?=+$/gm, ' ')

  if (article.description || article.extract) {
    add({
      question: `O que é ${article.title}?`,
      answer: article.description || splitSentences(article.extract)[0] || article.extract,
    })
  }

  const strict = shuffle([...new Set(splitSentences(text, 40))])
  const loose = shuffle([...new Set(splitSentences(text, 25))])

  const cloze = (sentence, keyword) =>
    add({ question: `Complete a lacuna: ${blank(sentence, keyword)}`, answer: keyword })

  for (const s of strict) {
    const kw = candidateKeywords(s, article.title, 6)[0]
    if (kw) cloze(s, kw) // 1
  }
  for (const s of strict) {
    const kw = candidateKeywords(s, article.title, 6)[1]
    if (kw) cloze(s, kw) // 2
  }
  for (const s of loose) {
    const kws = candidateKeywords(s, article.title, 4)
    if (kws[0]) cloze(s, kws[0]) // 3
  }
  for (const s of loose) {
    const kws = candidateKeywords(s, article.title, 4)
    if (kws[1]) cloze(s, kws[1])
  }
  for (const s of loose) {
    const start = s.split(' ').slice(0, 5).join(' ')
    add({
      question: `Segundo a Wikipédia, o que se sabe sobre “${start}…”?`,
      answer: s,
    }) // 4
  }
  for (const s of loose) {
    add({ question: `Verdadeiro ou falso? ${s}`, answer: 'Verdadeiro, segundo a Wikipédia.' }) // 5
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

/** Se o artigo principal for curto demais, junta texto de artigos relacionados. */
async function fetchRelatedText(topic, mainTitle) {
  try {
    const results = await searchArticles(topic, { limit: 5 })
    const others = results.filter((r) => r.title !== mainTitle).slice(0, 3)
    const texts = await Promise.all(others.map((r) => getArticleFullText(r.title).catch(() => '')))
    return texts.join(' ')
  } catch {
    return ''
  }
}

/** @returns {Promise<{data: object, source: 'wikipedia'}>} */
export async function generateSummary(topic) {
  return { data: buildSummary(await getArticle(topic)), source: 'wikipedia' }
}

/** @returns {Promise<{data: Array<{question: string, answer: string}>, source: 'wikipedia'}>} */
export async function generateFlashcards(topic, count = 4) {
  let article = await getArticle(topic)
  const available = splitSentences(article.fullText || article.extract || '').length
  if (available < count) {
    article = { ...article, relatedText: await fetchRelatedText(topic, article.title) }
  }
  return { data: buildFlashcards(article, count), source: 'wikipedia' }
}
