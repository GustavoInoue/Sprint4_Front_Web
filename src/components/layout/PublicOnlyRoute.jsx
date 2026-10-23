import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

/** Login/Cadastro: quem já está logado vai direto para o painel. */
export default function PublicOnlyRoute() {
  const { user } = useAuth()
  if (user) return <Navigate to="/app" replace />
  return <Outlet />
}
