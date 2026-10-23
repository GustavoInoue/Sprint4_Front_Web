import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import AuthForm from './AuthForm'
import AuthShell from './AuthShell'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleRegister(values) {
    await register(values)
    navigate('/app', { replace: true })
  }

  return (
    <AuthShell
      title="Crie sua"
      accent="conta."
      subtitle="Leva menos de um minuto. Seus estudos ficam salvos neste navegador."
      footer={
        <>
          Já tem conta? <Link to="/login" className="font-bold text-lavender underline underline-offset-4">Entrar</Link>
        </>
      }
    >
      <AuthForm mode="register" onSubmit={handleRegister} />
    </AuthShell>
  )
}
