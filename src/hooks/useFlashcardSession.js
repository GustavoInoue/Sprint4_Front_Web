import { useMemo, useState } from 'react'
import { progressRatio, scoreLabel, scorePercent, shuffle } from '../utils/math'

/** Estado de uma sessão de revisão de flashcards. */
export default function useFlashcardSession(cards) {
  const [deck] = useState(() => shuffle(cards))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [results, setResults] = useState([])
  const [done, setDone] = useState(false)

  const total = deck.length
  const progressPct = Math.round(progressRatio(index, total) * 100)

  const summary = useMemo(() => {
    const count = (v) => results.filter((r) => r === v).length
    const correct = count('correct')
    const partial = count('partial')
    const wrong = count('wrong')
    const score = scorePercent(correct + partial * 0.5, total)
    return { correct, partial, wrong, score, label: scoreLabel(score) }
  }, [results, total])

  const flip = () => setFlipped((f) => !f)

  function answer(value) {
    setResults((r) => [...r, value])
    if (index + 1 >= total) setDone(true)
    else {
      setIndex((i) => i + 1)
      setFlipped(false)
    }
  }

  function restart() {
    setIndex(0)
    setFlipped(false)
    setResults([])
    setDone(false)
  }

  return { current: deck[index], index, total, flipped, done, progressPct, summary, flip, answer, restart }
}
