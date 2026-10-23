import { useEffect, useState } from 'react'
import { sendContactMessage } from '../services/communityApi'

const EMPTY = { name: '', email: '', message: '' }

/** Lógica do formulário de contato (estado, envio e mensagem de sucesso). */
export default function useContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  useEffect(() => {
    if (status !== 'success') return undefined
    const id = setTimeout(() => setStatus('idle'), 5000)
    return () => clearTimeout(id)
  }, [status])

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendContactMessage(values)
      setValues(EMPTY)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return { values, status, onChange, onSubmit }
}
