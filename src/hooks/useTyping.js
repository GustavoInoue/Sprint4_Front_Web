import { useEffect, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

/** Efeito de "digitando" que alterna entre várias palavras. */
export default function useTyping(words, { speed = 70, hold = 1400 } = {}) {
  const reduced = usePrefersReducedMotion()
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduced) return undefined
    const word = words[wordIndex]
    let delay = deleting ? speed / 2 : speed

    if (!deleting && text === word) delay = hold
    const id = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true)
      else if (deleting && text === '') {
        setDeleting(false)
        setWordIndex((i) => (i + 1) % words.length)
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
      }
    }, delay)
    return () => clearTimeout(id)
  }, [text, deleting, wordIndex, words, speed, hold, reduced])

  return reduced ? words[0] : text
}
