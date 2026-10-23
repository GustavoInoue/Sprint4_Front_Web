import { useState } from 'react'
import { generateFlashcards, generateSummary } from '../services/wikipediaStudy'
import useHistory from './useHistory'

/** Toda a lógica da página "Gerar": formulário, chamadas de IA e salvamento. */
export default function useGenerator(initialTopic = '') {
  const { addEntry } = useHistory()
  const [topic, setTopic] = useState(initialTopic)
  const [contentType, setContentType] = useState('summary')
  const [cardCount, setCardCount] = useState(4)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState(null)
  const [flashcards, setFlashcards] = useState(null)
  const [source, setSource] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')

  async function generate(event) {
    event?.preventDefault()
    const trimmed = topic.trim()
    if (!trimmed) return

    setLoading(true)
    setError('')
    setSummary(null)
    setFlashcards(null)

    try {
      if (contentType === 'summary' || contentType === 'both') {
        const { data, source: origin } = await generateSummary(trimmed)
        setSummary(data)
        setSource(origin)
        setActiveTab('summary')
        addEntry({ topic: trimmed, type: 'summary', data, source: origin })
      }
      if (contentType === 'flashcards' || contentType === 'both') {
        const { data, source: origin } = await generateFlashcards(trimmed, cardCount)
        setFlashcards(data)
        setSource(origin)
        if (contentType === 'flashcards') setActiveTab('flashcards')
        addEntry({ topic: trimmed, type: 'flashcards', data, source: origin })
      }
    } catch (err) {
      setError(err.message || 'Erro desconhecido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return {
    topic, setTopic: (v) => { setTopic(v); setError('') },
    contentType, setContentType,
    cardCount, setCardCount,
    loading, error, summary, flashcards, source,
    activeTab, setActiveTab,
    generate,
  }
}
