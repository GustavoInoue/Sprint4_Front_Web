// Autenticação SIMULADA (front-end only) para fins acadêmicos.
// Usuários ficam no localStorage e as senhas são guardadas como hash SHA-256.

const USERS_KEY = 'codecam_users'
const SESSION_KEY = 'codecam_session'

export const DEMO_USER = {
  name: 'Estudante Demo',
  email: 'demo@codecam.com',
  password: 'codecam123',
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function sha256(text) {
  const bytes = new TextEncoder().encode(text)
  const buffer = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
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

export function getSession() {
  return read(SESSION_KEY, null)
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

export async function registerUser({ name, email, password }) {
  await delay(450)
  const normalized = email.trim().toLowerCase()
  if (name.trim().length < 2) throw new Error('Informe seu nome.')
  if (!/^\S+@\S+\.\S+$/.test(normalized)) throw new Error('E-mail inválido.')
  if (password.length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.')

  const users = read(USERS_KEY, [])
  if (normalized === DEMO_USER.email || users.some((u) => u.email === normalized)) {
    throw new Error('Já existe uma conta com esse e-mail.')
  }
  users.push({ name: name.trim(), email: normalized, hash: await sha256(password) })
  write(USERS_KEY, users)
  return openSession({ name: name.trim(), email: normalized })
}

export async function loginUser({ email, password }) {
  await delay(450)
  const normalized = email.trim().toLowerCase()

  if (normalized === DEMO_USER.email && password === DEMO_USER.password) {
    return openSession(DEMO_USER)
  }
  const user = read(USERS_KEY, []).find((u) => u.email === normalized)
  if (!user || user.hash !== (await sha256(password))) {
    throw new Error('E-mail ou senha incorretos.')
  }
  return openSession(user)
}
