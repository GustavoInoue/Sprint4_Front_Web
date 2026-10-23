import { useState } from 'react'
import Spinner from '../components/ui/Spinner'

/** Formulário reutilizado por Login e Cadastro. */
export default function AuthForm({ mode, onSubmit }) {
  const isRegister = mode === 'register'
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      {isRegister && (
        <div>
          <label className="label" htmlFor="name">Nome</label>
          <input id="name" name="name" className="field" autoComplete="name" value={values.name} onChange={onChange} placeholder="Seu nome" required />
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" className="field" autoComplete="email" value={values.email} onChange={onChange} placeholder="nome@email.com" required />
      </div>
      <div>
        <label className="label" htmlFor="password">Senha</label>
        <input id="password" name="password" type="password" className="field" autoComplete={isRegister ? 'new-password' : 'current-password'} value={values.password} onChange={onChange} placeholder="••••••••" required minLength={isRegister ? 6 : undefined} />
      </div>
      {error && (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
      )}
      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? <><Spinner /> Aguarde...</> : isRegister ? 'Criar conta' : 'Entrar'}
      </button>
    </form>
  )
}
