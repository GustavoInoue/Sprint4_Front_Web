import { useEffect, useRef, useState } from 'react'
import useAccessibility from '../../hooks/useAccessibility'
import Icon from './Icon'

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-3 text-left text-sm hover:bg-white/5"
    >
      <span>{label}</span>
      <span className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-violet' : 'bg-[#383641]'}`}>
        <span className={`absolute top-[3px] size-3.5 rounded-full bg-white transition-all ${checked ? 'left-[19px]' : 'left-[3px]'}`} />
      </span>
    </button>
  )
}

const SIZES = [
  { value: 0, label: 'A', cls: 'text-xs' },
  { value: 1, label: 'A', cls: 'text-sm' },
  { value: 2, label: 'A', cls: 'text-lg' },
]

export default function AccessibilityMenu() {
  const { settings, toggleContrast, toggleDyslexia, setSize, reset } = useAccessibility()
  const [open, setOpen] = useState(false)
  const box = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onClick = (e) => !box.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={box}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Ajustes de acessibilidade"
        className="grid size-10 place-items-center rounded-full border border-line text-white transition hover:border-violet-bright hover:bg-violet/15"
      >
        <Icon name="access" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-72 animate-pop rounded-2xl border border-line bg-[#0d0c14] p-3 shadow-2xl">
          <p className="px-3 pb-2 pt-1 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-violet-bright">
            Acessibilidade
          </p>
          <Switch checked={settings.contrast} onChange={toggleContrast} label="Alto contraste" />
          <Switch checked={settings.dyslexia} onChange={toggleDyslexia} label="Fonte para dislexia" />
          <div className="flex items-center justify-between gap-3 px-3 py-3 text-sm">
            <span>Tamanho do texto</span>
            <div className="flex gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSize(s.value)}
                  aria-label={`Tamanho ${s.value + 1} de 3`}
                  aria-pressed={settings.size === s.value}
                  className={`grid size-8 place-items-center rounded-lg border font-bold ${s.cls} ${
                    settings.size === s.value ? 'border-violet bg-violet text-white' : 'border-line text-muted hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={reset} className="mt-1 w-full rounded-xl px-3 py-2 text-left text-xs text-muted hover:text-white">
            Restaurar padrão
          </button>
        </div>
      )}
    </div>
  )
}
