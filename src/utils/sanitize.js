// Limpeza e validação de dados que entram e saem do app.
// O MockAPI é público: qualquer pessoa pode gravar nele, então tudo que vem
// de lá é tratado como não confiável antes de chegar na interface.

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g

export const LIMITS = {
  author: 40,
  topic: 100,
  description: 200,
  question: 600,
  answer: 1500,
  cards: 100,
  name: 80,
  email: 120,
  message: 1000,
}

/** Converte para texto, remove caracteres de controle/invisíveis, normaliza espaços e corta no limite. */
export function cleanText(value, max) {
  if (typeof value !== 'string' && typeof value !== 'number') return ''
  return String(value).replace(CONTROL_CHARS, '').replace(/[ \t]+/g, ' ').trim().slice(0, max)
}

/** Texto de várias linhas: mantém quebras de linha, mas limita a 3 seguidas. */
export function cleanMultiline(value, max) {
  if (typeof value !== 'string') return ''
  return value
    .replace(CONTROL_CHARS, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max)
}

export function isValidEmail(email) {
  return email.length <= LIMITS.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

/** Mantém só cartões {question, answer} válidos e com tamanho controlado. */
export function cleanCards(cards) {
  if (!Array.isArray(cards)) return []
  return cards
    .slice(0, LIMITS.cards)
    .map((c) => ({
      question: cleanText(c?.question, LIMITS.question),
      answer: cleanText(c?.answer, LIMITS.answer),
    }))
    .filter((c) => c.question && c.answer)
}

function safeDate(value) {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString()
}

/** Normaliza um baralho vindo da API. Retorna null se não for aproveitável. */
export function normalizeDeck(raw) {
  if (!raw || typeof raw !== 'object') return null
  const id = typeof raw.id === 'string' || typeof raw.id === 'number' ? String(raw.id) : ''
  const topic = cleanText(raw.topic, LIMITS.topic)
  const cards = cleanCards(raw.cards)
  if (!id || !topic || !cards.length) return null
  const likes = Number.isFinite(Number(raw.likes)) ? Math.max(0, Math.floor(Number(raw.likes))) : 0
  return {
    id,
    topic,
    author: cleanText(raw.author, LIMITS.author) || 'Anônimo',
    description: cleanText(raw.description, LIMITS.description) || `Flashcards sobre ${topic}.`,
    likes,
    createdAt: safeDate(raw.createdAt),
    cards,
  }
}
