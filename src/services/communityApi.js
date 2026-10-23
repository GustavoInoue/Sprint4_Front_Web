// API da Comunidade (baralhos compartilhados).
// - Com VITE_MOCKAPI_URL: consome o MockAPI (recurso "decks" e "mensagens").
// - Sem a variável: "modo local" com dados iniciais salvos no navegador.

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
    if (raw) return JSON.parse(raw)
  } catch {
    /* noop */
  }
  return SEED
}

function writeLocal(decks) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(decks))
  } catch {
    /* noop */
  }
}

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`Falha na API da comunidade (${res.status}).`)
  return res.json()
}

export async function listDecks() {
  if (!isRemote) return readLocal()
  const decks = await request('/decks?sortBy=createdAt&order=desc')
  return decks.map((d) => ({ ...d, cards: Array.isArray(d.cards) ? d.cards : [] }))
}

export async function publishDeck({ author, topic, description, cards }) {
  const deck = { author, topic, description, cards, likes: 0, createdAt: new Date().toISOString() }
  if (!isRemote) {
    const created = { ...deck, id: `local-${Date.now()}` }
    writeLocal([created, ...readLocal()])
    return created
  }
  return request('/decks', { method: 'POST', body: JSON.stringify(deck) })
}

export async function likeDeck(deck) {
  const likes = (deck.likes ?? 0) + 1
  if (!isRemote) {
    const updated = readLocal().map((d) => (d.id === deck.id ? { ...d, likes } : d))
    writeLocal(updated)
    return { ...deck, likes }
  }
  return request(`/decks/${deck.id}`, { method: 'PUT', body: JSON.stringify({ likes }) })
}

export async function sendContactMessage({ name, email, message }) {
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
