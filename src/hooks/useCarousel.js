import { useCallback, useEffect, useState } from 'react'
import usePrefersReducedMotion from './usePrefersReducedMotion'

/** Lógica do carrossel da galeria: autoplay, pausa, próximo/anterior. */
export default function useCarousel(length, interval = 3500) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = usePrefersReducedMotion()

  const goTo = useCallback((i) => setIndex(((i % length) + length) % length), [length])
  const next = useCallback(() => setIndex((i) => (i + 1) % length), [length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + length) % length), [length])

  useEffect(() => {
    if (paused || reduced) return undefined
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [paused, reduced, interval, next])

  return { index, goTo, next, prev, paused, setPaused }
}
