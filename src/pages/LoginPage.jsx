import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { DEMO_USER } from '../services/authService'
import AuthForm from './AuthForm'
import AuthShell from './AuthShell'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from
  const destination = from ? `${from.pathname}${from.search ?? ''}` : '/app'

  async function handleLogin(values) {
    await login(values)
    navigate(destination, { replace: true })
  }

  return (
    <AuthShell
      title="Bem-vindo de"
      accent="volta."
      subtitle="Entre para gerar resumos, treinar com flashcards e acompanhar sua evolução."
      footer={
        <>
          Ainda não tem conta? <Link to="/registrar" className="font-bold text-lavender underline underline-offset-4">Criar conta</Link>
        </>
      }
    >
      {from && (
        <p className="mb-5 rounded-xl border border-lime/30 bg-lime/10 px-4 py-3 text-sm text-lime">
          Essa página é privada. Entre para continuar.
        </p>
      )}
      <AuthForm mode="login" onSubmit={handleLogin} />
      <div className="mt-6 rounded-xl border border-dashed border-line p-4 text-xs text-muted">
        <p className="font-bold text-white">Conta de teste</p>
        <p className="mt-1">E-mail: <code className="text-lavender">{DEMO_USER.email}</code></p>
        <p>Senha: <code className="text-lavender">{DEMO_USER.password}</code></p>
      </div>
    </AuthShell>
  )
}
