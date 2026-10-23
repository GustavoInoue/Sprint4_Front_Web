import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Rola até a âncora (#secao) ou volta ao topo a cada navegação. */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60)
      return () => clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
    return undefined
  }, [pathname, hash, key])
  return null
}
