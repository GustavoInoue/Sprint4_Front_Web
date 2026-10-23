import { daysSince } from './math'

const DAY = 1000 * 60 * 60 * 24

function dayKey(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

/** Dias consecutivos (até hoje/ontem) com pelo menos uma geração. */
export function calcStreak(history) {
  if (!history.length) return 0
  const days = new Set(history.map((h) => dayKey(h.createdAt)))
  let streak = 0
  let cursor = Date.now()
  if (!days.has(dayKey(new Date(cursor)))) cursor -= DAY
  while (days.has(dayKey(new Date(cursor)))) {
    streak += 1
    cursor -= DAY
  }
  return streak
}

export function calcStats(history) {
  const summaries = history.filter((h) => h.type === 'summary').length
  const flashcards = history
    .filter((h) => h.type === 'flashcards' && Array.isArray(h.data))
    .reduce((acc, h) => acc + h.data.length, 0)
  const first = history.length ? history[history.length - 1].createdAt : null
  return {
    summaries,
    flashcards,
    total: history.length,
    firstUsedAt: first,
    daysUsing: first ? daysSince(first) : 0,
    streak: calcStreak(history),
  }
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
