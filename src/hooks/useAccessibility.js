import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'

const DEFAULTS = { contrast: false, size: 0, dyslexia: false }

/** Preferências de acessibilidade aplicadas no <html> e salvas no navegador. */
export default function useAccessibility() {
  const [settings, setSettings] = useLocalStorage('codecam_a11y', DEFAULTS)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.contrast = settings.contrast ? 'high' : 'normal'
    root.dataset.size = String(settings.size)
    root.dataset.font = settings.dyslexia ? 'dyslexia' : 'default'
  }, [settings])

  const toggleContrast = () => setSettings((s) => ({ ...s, contrast: !s.contrast }))
  const toggleDyslexia = () => setSettings((s) => ({ ...s, dyslexia: !s.dyslexia }))
  const setSize = (size) => setSettings((s) => ({ ...s, size }))
  const reset = () => setSettings(DEFAULTS)

  return { settings, toggleContrast, toggleDyslexia, setSize, reset }
}
