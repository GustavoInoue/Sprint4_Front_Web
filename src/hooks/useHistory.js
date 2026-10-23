import { useCallback, useMemo } from 'react'
import useAuth from './useAuth'
import useLocalStorage from './useLocalStorage'
import { calcStats } from '../utils/stats'
import { generateId } from '../utils/math'

/** Histórico de gerações do usuário logado (separado por e-mail). */
export default function useHistory() {
  const { user } = useAuth()
  const [history, setHistory] = useLocalStorage(`codecam_history_${user?.email ?? 'anon'}`, [])

  const addEntry = useCallback(
    (entry) =>
      setHistory((list) => [
        { id: generateId(), createdAt: new Date().toISOString(), ...entry },
        ...list,
      ]),
    [setHistory],
  )
  const removeEntry = useCallback((id) => setHistory((list) => list.filter((e) => e.id !== id)), [setHistory])
  const clear = useCallback(() => setHistory([]), [setHistory])
  const stats = useMemo(() => calcStats(history), [history])

  return { history, addEntry, removeEntry, clear, stats }
}
