/**
 * Clamps a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Shuffles an array using Fisher-Yates algorithm (uses Math.random).
 * Returns a new shuffled array.
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
export function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Calculates the percentage of correct answers, rounded to one decimal place.
 * @param {number} correct
 * @param {number} total
 * @returns {number}
 */
export function scorePercent(correct, total) {
  if (total === 0) return 0
  return Math.round((correct / total) * 1000) / 10
}

/**
 * Returns a progress value between 0 and 1 for a given step.
 * @param {number} current
 * @param {number} total
 * @returns {number}
 */
export function progressRatio(current, total) {
  if (total === 0) return 0
  return clamp(current / total, 0, 1)
}

/**
 * Formats a number as a percentage string with one decimal place.
 * @param {number} value  — value between 0 and 100
 * @returns {string}
 */
export function formatPercent(value) {
  return `${Math.round(value * 10) / 10}%`
}

/**
 * Returns the number of days since a given ISO date string.
 * Uses Math.floor for whole-day rounding.
 * @param {string} isoDate
 * @returns {number}
 */
export function daysSince(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Picks a random element from an array.
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
export function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Generates a short unique ID using Math.random and base-36 encoding.
 * @returns {string}
 */
export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Returns a motivational score label based on percentage.
 * @param {number} percent
 * @returns {string}
 */
export function scoreLabel(percent) {
  if (percent >= 90) return 'Excelente'
  if (percent >= 70) return 'Muito bom'
  if (percent >= 50) return 'Bom'
  if (percent >= 30) return 'Regular'
  return 'Precisa melhorar'
}
