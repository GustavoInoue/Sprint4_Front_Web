import { Outlet } from 'react-router-dom'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

export default function PublicLayout() {
  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-2.5 top-2.5 z-[1000] -translate-y-[160%] rounded-lg bg-white px-4 py-2.5 text-ink transition focus:translate-y-0"
      >
        Ir para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}
