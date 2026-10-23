import Em from '../components/ui/Em'

export default function AuthShell({ title, accent, subtitle, children, footer }) {
  return (
    <section className="grid-bg relative flex min-h-dvh items-center overflow-hidden pb-16 pt-32">
      <div className="pointer-events-none absolute -right-40 top-10 size-[600px] rounded-full bg-violet/20 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid w-[min(1080px,calc(100%-32px))] items-center gap-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <p className="eyebrow">Área do estudante</p>
          <h1 className="text-7xl font-bold">
            {title} <Em>{accent}</Em>
          </h1>
          <p className="mt-6 max-w-[420px] text-[#aaa7b2]">{subtitle}</p>
        </div>
        <div className="rounded-[32px] border border-line bg-surface/90 p-7 shadow-phone backdrop-blur sm:p-10">
          <h1 className="mb-6 text-3xl font-bold lg:hidden">{title} <Em>{accent}</Em></h1>
          {children}
          <div className="mt-6 text-sm text-muted">{footer}</div>
        </div>
      </div>
    </section>
  )
}
