import { useCallback, useEffect, useState } from 'react'
import { likeDeck, listDecks, publishDeck } from '../services/communityApi'

/** Carrega, publica e curte baralhos da comunidade. */
export default function useCommunity() {
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setDecks(await listDecks())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function publish(payload) {
    const created = await publishDeck(payload)
    setDecks((list) => [created, ...list])
    return created
  }

  async function like(deck) {
    setDecks((list) => list.map((d) => (d.id === deck.id ? { ...d, likes: (d.likes ?? 0) + 1 } : d)))
    try {
      await likeDeck(deck)
    } catch (err) {
      setError(err.message)
      load()
    }
  }

  return { decks, loading, error, reload: load, publish, like }
}
