// API da Comunidade (baralhos compartilhados).
// - Com VITE_MOCKAPI_URL: consome o MockAPI (recurso "decks" e "mensagens").
// - Sem a variável: "modo local" com dados iniciais salvos no navegador.
// O MockAPI é público: tudo que entra e sai passa por validação (utils/sanitize.js).

import { LIMITS, cleanCards, cleanMultiline, cleanText, isValidEmail, normalizeDeck } from '../utils/sanitize'

const BASE = (import.meta.env.VITE_MOCKAPI_URL || '').replace(/\/$/, '')
export const isRemote = Boolean(BASE)

const LOCAL_KEY = 'codecam_community_local'

const SEED = [
  {
    id: 'seed-1',
    author: 'Lara B.',
    topic: 'Fotossíntese',
    description: 'Etapas da fase clara e escura, cloroplastos e equação geral.',
    likes: 24,
    createdAt: '2026-08-20T13:00:00.000Z',
    cards: [
      { question: 'Onde ocorre a fotossíntese nas células vegetais?', answer: 'Nos cloroplastos.' },
      { question: 'Quais são os produtos da fotossíntese?', answer: 'Glicose e gás oxigênio.' },
      { question: 'Qual pigmento capta a luz?', answer: 'A clorofila.' },
    ],
  },
  {
    id: 'seed-2',
    author: 'Rafael D.',
    topic: 'Revolução Francesa',
    description: 'Causas, fases e consequências entre 1789 e 1799.',
    likes: 17,
    createdAt: '2026-08-25T18:30:00.000Z',
    cards: [
      { question: 'Em que ano ocorreu a Queda da Bastilha?', answer: '1789.' },
      { question: 'Qual lema resume os ideais revolucionários?', answer: 'Liberdade, igualdade e fraternidade.' },
    ],
  },
  {
    id: 'seed-3',
    author: 'Luca B.',
    topic: 'Álgebra Linear',
    description: 'Vetores, matrizes, determinantes e autovalores.',
    likes: 9,
    createdAt: '2026-09-02T10:15:00.000Z',
    cards: [
      { question: 'O que é uma matriz identidade?', answer: 'Matriz quadrada com 1 na diagonal principal e 0 no restante.' },
      { question: 'Para que serve o determinante?', answer: 'Indica se a matriz é invertível e o fator de escala do volume.' },
    ],
  },
]

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.map(normalizeDeck).filter(Boolean)
    }
  } catch {
    /* noop */
  }
  return SEED.map(normalizeDeck).filter(Boolean)
}

function writeLocal(decks) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(decks))
  } catch {
    /* noop */
  }
}

const REQUEST_TIMEOUT_MS = 10000
const COOLDOWN_MS = 8000
const lastAction = { publish: 0, contact: 0 }

/** Evita envios em sequência (spam acidental ou automatizado). */
function checkCooldown(kind) {
  const wait = lastAction[kind] + COOLDOWN_MS - Date.now()
  if (wait > 0) throw new Error(`Aguarde ${Math.ceil(wait / 1000)}s antes de enviar de novo.`)
  lastAction[kind] = Date.now()
}

async function request(path, options) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    })
    if (!res.ok) throw new Error(`Falha na API da comunidade (${res.status}).`)
    return await res.json()
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('A API da comunidade demorou demais para responder.')
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export async function listDecks() {
  if (!isRemote) return readLocal()
  const decks = await request('/decks?sortBy=createdAt&order=desc')
  if (!Array.isArray(decks)) return []
  return decks.map(normalizeDeck).filter(Boolean)
}

export async function publishDeck(input) {
  const topic = cleanText(input.topic, LIMITS.topic)
  const cards = cleanCards(input.cards)
  if (!topic || !cards.length) throw new Error('Esse baralho não tem conteúdo válido para publicar.')
  checkCooldown('publish')
  const deck = {
    author: cleanText(input.author, LIMITS.author) || 'Anônimo',
    topic,
    description: cleanText(input.description, LIMITS.description) || `Flashcards sobre ${topic}.`,
    cards,
    likes: 0,
    createdAt: new Date().toISOString(),
  }
  if (!isRemote) {
    const created = { ...deck, id: `local-${Date.now()}` }
    writeLocal([created, ...readLocal()])
    return created
  }
  const created = normalizeDeck(await request('/decks', { method: 'POST', body: JSON.stringify(deck) }))
  if (!created) throw new Error('A API devolveu uma resposta inesperada.')
  return created
}

export async function likeDeck(deck) {
  const likes = (deck.likes ?? 0) + 1
  if (!isRemote) {
    const updated = readLocal().map((d) => (d.id === deck.id ? { ...d, likes } : d))
    writeLocal(updated)
    return { ...deck, likes }
  }
  return request(`/decks/${encodeURIComponent(deck.id)}`, { method: 'PUT', body: JSON.stringify({ likes }) })
}

export async function sendContactMessage(input) {
  const name = cleanText(input.name, LIMITS.name)
  const email = cleanText(input.email, LIMITS.email).toLowerCase()
  const message = cleanMultiline(input.message, LIMITS.message)
  if (name.length < 2) throw new Error('Informe seu nome.')
  if (!isValidEmail(email)) throw new Error('Informe um e-mail válido.')
  if (message.length < 5) throw new Error('Escreva uma mensagem um pouco maior.')
  checkCooldown('contact')
  if (!isRemote) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return { ok: true }
  }
  await request('/mensagens', {
    method: 'POST',
    body: JSON.stringify({ name, email, message, createdAt: new Date().toISOString() }),
  })
  return { ok: true }
}
