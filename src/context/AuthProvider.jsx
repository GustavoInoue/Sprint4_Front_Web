import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import { clearSession, getSession, loginUser, registerUser } from '../services/authService'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession())

  const login = useCallback(async (credentials) => {
    const session = await loginUser(credentials)
    setUser(session)
    return session
  }, [])

  const register = useCallback(async (data) => {
    const session = await registerUser(data)
    setUser(session)
    return session
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
