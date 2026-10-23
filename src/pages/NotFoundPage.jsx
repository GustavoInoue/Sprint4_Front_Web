import { Link } from 'react-router-dom'
import Em from '../components/ui/Em'

export default function NotFoundPage() {
  return (
    <section className="grid-bg grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="eyebrow justify-center">Erro 404</p>
        <h1 className="text-[clamp(4rem,12vw,9rem)] font-bold">Página <Em>perdida.</Em></h1>
        <p className="mx-auto mt-6 max-w-md text-muted">Parece que essa lousa não existe. Volte ao início e continue estudando.</p>
        <Link to="/" className="btn btn-primary mt-8">Voltar ao início</Link>
      </div>
    </section>
  )
}
