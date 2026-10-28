// Autenticação SIMULADA (front-end only) para fins acadêmicos.
// Usuários ficam no localStorage do navegador. As senhas são guardadas com
// PBKDF2-SHA256 + salt aleatório (contas antigas em SHA-256 são migradas no login).
// Sem back-end não existe proteção real: quem controla o navegador controla esses dados.

import { LIMITS, cleanText, isValidEmail } from '../utils/sanitize'

const USERS_KEY = 'codecam_users'
const SESSION_KEY = 'codecam_session'

const PBKDF2_ITERATIONS = 200_000
const MIN_PASSWORD = 8
const MAX_PASSWORD = 128
const MAX_ATTEMPTS = 5
const LOCK_MS = 30_000
const WEAK_PASSWORDS = new Set(['12345678', '123456789', '1234567890', 'password', 'senha123', 'qwertyui', '11111111', 'abcd1234'])

export const DEMO_USER = {
  name: 'Estudante Demo',
  email: 'demo@codecam.com',
  password: 'codecam123',
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

const fromHex = (hex) => Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => parseInt(byte, 16))

/** Hash antigo (sem salt). Mantido só para migrar contas já criadas. */
async function sha256(text) {
  return toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))
}

async function pbkdf2(password, saltHex, iterations) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations },
    key,
    256,
  )
  return toHex(bits)
}

function newSalt() {
  return toHex(crypto.getRandomValues(new Uint8Array(16)))
}

/** Comparação sem sair no primeiro caractere diferente. */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* armazenamento indisponível */
  }
}

/** Só aceita usuários com o formato esperado (o localStorage pode ter sido editado). */
function readUsers() {
  const list = read(USERS_KEY, [])
  if (!Array.isArray(list)) return []
  return list.filter(
    (u) => u && typeof u.email === 'string' && typeof u.name === 'string' && typeof u.hash === 'string',
  )
}

export function getSession() {
  const s = read(SESSION_KEY, null)
  if (!s || typeof s.name !== 'string' || typeof s.email !== 'string') return null
  const name = cleanText(s.name, LIMITS.name)
  const email = cleanText(s.email, LIMITS.email)
  return name && email ? { name, email } : null
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* noop */
  }
}

function openSession({ name, email }) {
  const session = { name, email }
  write(SESSION_KEY, session)
  return session
}

// Bloqueio temporário após várias tentativas erradas (só na memória da aba).
const attempts = new Map()

function assertNotLocked(email) {
  const entry = attempts.get(email)
  if (entry && entry.lockedUntil > Date.now()) {
    throw new Error(`Muitas tentativas. Aguarde ${Math.ceil((entry.lockedUntil - Date.now()) / 1000)}s e tente de novo.`)
  }
}

function registerFailure(email) {
  const entry = attempts.get(email) ?? { count: 0, lockedUntil: 0 }
  entry.count += 1
  if (entry.count >= MAX_ATTEMPTS) {
    entry.count = 0
    entry.lockedUntil = Date.now() + LOCK_MS
  }
  attempts.set(email, entry)
}

export async function registerUser({ name, email, password }) {
  await delay(450)
  const cleanName = cleanText(name, LIMITS.name)
  const normalized = cleanText(email, LIMITS.email).toLowerCase()
  if (cleanName.length < 2) throw new Error('Informe seu nome.')
  if (!isValidEmail(normalized)) throw new Error('E-mail inválido.')
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    throw new Error(`A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`)
  }
  if (password.length > MAX_PASSWORD) throw new Error(`A senha pode ter no máximo ${MAX_PASSWORD} caracteres.`)
  if (WEAK_PASSWORDS.has(password.toLowerCase()) || password.toLowerCase() === normalized) {
    throw new Error('Essa senha é muito fácil de adivinhar. Escolha outra.')
  }

  const users = readUsers()
  if (normalized === DEMO_USER.email || users.some((u) => u.email === normalized)) {
    throw new Error('Já existe uma conta com esse e-mail.')
  }
  const salt = newSalt()
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS)
  users.push({ name: cleanName, email: normalized, v: 2, salt, iterations: PBKDF2_ITERATIONS, hash })
  write(USERS_KEY, users)
  return openSession({ name: cleanName, email: normalized })
}

export async function loginUser({ email, password }) {
  await delay(450)
  const normalized = cleanText(email, LIMITS.email).toLowerCase()
  assertNotLocked(normalized)
  const pass = typeof password === 'string' ? password.slice(0, MAX_PASSWORD) : ''

  if (normalized === DEMO_USER.email && safeEqual(pass, DEMO_USER.password)) {
    attempts.delete(normalized)
    return openSession(DEMO_USER)
  }

  const users = readUsers()
  const user = users.find((u) => u.email === normalized)
  let ok = false
  if (user) {
    if (user.v === 2 && typeof user.salt === 'string' && Number.isInteger(user.iterations)) {
      ok = safeEqual(await pbkdf2(pass, user.salt, user.iterations), user.hash)
    } else {
      // Conta antiga (SHA-256 sem salt): confere e já regrava com PBKDF2.
      ok = safeEqual(await sha256(pass), user.hash)
      if (ok) {
        user.salt = newSalt()
        user.iterations = PBKDF2_ITERATIONS
        user.hash = await pbkdf2(pass, user.salt, user.iterations)
        user.v = 2
        write(USERS_KEY, users)
      }
    }
  }
  if (!ok) {
    registerFailure(normalized)
    throw new Error('E-mail ou senha incorretos.')
  }
  attempts.delete(normalized)
  return openSession(user)
}
