export default function StatCard({ label, value, sub, highlight = false }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? 'border-violet/50 bg-violet/15' : 'border-line bg-surface'}`}>
      <p className="bg-linear-to-br from-lavender to-violet-bright bg-clip-text text-3xl font-black tracking-tight text-transparent">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold text-[#c9c6d1]">{label}</p>
      {sub && <p className="mt-0.5 text-[0.7rem] text-muted">{sub}</p>}
    </div>
  )
}
