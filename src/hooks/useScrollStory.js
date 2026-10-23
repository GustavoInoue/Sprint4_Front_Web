import { useCallback, useEffect, useRef, useState } from 'react'

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const smooth = (x) => {
  const t = clamp(x, 0, 1)
  return t * t * (3 - 2 * t)
}

/**
 * Scrollytelling: enquanto a "pista" (track) passa pela tela, o palco (stage) fica fixo e
 * as telas avançam conforme a rolagem.
 *
 * - Escreve --pos (posição contínua entre as telas, com "pausa" em cada uma) e --p (0 a 1)
 *   direto no palco, sem re-renderizar o React a cada frame.
 * - Só atualiza o estado `index` quando a tela ativa muda (poucas vezes na página inteira).
 * - `goTo(i)` rola a página até a tela i (usado pelos pontos e pelas setas).
 */
export default function useScrollStory(count, { reduced = false } = {}) {
  const trackRef = useRef(null)
  const stageRef = useRef(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    if (!track || !stage) return undefined

    let frame = 0
    let last = -1

    function update() {
      frame = 0
      const rect = track.getBoundingClientRect()
      const total = Math.max(1, rect.height - window.innerHeight)
      const p = clamp(-rect.top / total, 0, 1)

      // Cada transição ocupa só o miolo do seu trecho: a tela "descansa" no começo e no fim.
      const t = p * (count - 1)
      const i = Math.min(Math.floor(t), count - 2)
      const pos = p >= 1 ? count - 1 : i + smooth((t - i - 0.25) / 0.5)

      stage.style.setProperty('--pos', pos.toFixed(4))
      stage.style.setProperty('--p', p.toFixed(4))

      const active = Math.round(pos)
      if (active !== last) {
        last = active
        setIndex(active)
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [count])

  const goTo = useCallback(
    (i) => {
      const track = trackRef.current
      if (!track) return
      const target = clamp(i, 0, count - 1)
      const total = Math.max(1, track.offsetHeight - window.innerHeight)
      const top = track.getBoundingClientRect().top + window.scrollY + (target / (count - 1)) * total
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
    },
    [count, reduced],
  )

  return { trackRef, stageRef, index, goTo }
}
