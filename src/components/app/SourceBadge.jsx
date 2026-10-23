export default function SourceBadge({ source }) {
  if (!source) return null
  return (
    <span className="inline-flex items-center rounded-full border border-lime/30 bg-lime/10 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-lime">
      Via Wikipédia
    </span>
  )
}
