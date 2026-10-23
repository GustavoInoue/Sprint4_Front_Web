import { Link } from 'react-router-dom'

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2.5 text-[1.08rem] font-bold tracking-[-0.04em]" aria-label="CodeCam — início">
      <img src="/logo-codecam.svg" alt="" className="size-9" />
      <span>CodeCam</span>
    </Link>
  )
}
