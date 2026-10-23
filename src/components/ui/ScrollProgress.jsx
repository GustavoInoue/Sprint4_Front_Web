/** Barra fina no topo que acompanha o quanto da página já foi lido (só com suporte a CSS scroll-driven). */
export default function ScrollProgress() {
  return (
    <div
      className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-violet-bright"
      aria-hidden="true"
    />
  )
}
