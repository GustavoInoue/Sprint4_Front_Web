import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import PublicLayout from './components/layout/PublicLayout'
import PublicOnlyRoute from './components/layout/PublicOnlyRoute'
import ScrollManager from './components/layout/ScrollManager'
import AuthProvider from './context/AuthProvider'
import CommunityPage from './pages/CommunityPage'
import DashboardPage from './pages/DashboardPage'
import ExplorePage from './pages/ExplorePage'
import GeneratePage from './pages/GeneratePage'
import HistoryPage from './pages/HistoryPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollManager />
        <Routes>
          {/* Rotas PÚBLICAS */}
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="explorar" element={<ExplorePage />} />
            <Route element={<PublicOnlyRoute />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="registrar" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Rotas PRIVADAS (exigem login) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="app" element={<DashboardPage />} />
              <Route path="gerar" element={<GeneratePage />} />
              <Route path="historico" element={<HistoryPage />} />
              <Route path="comunidade" element={<CommunityPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
