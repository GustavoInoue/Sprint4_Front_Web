export default function Em({ children, className = '' }) {
  return <em className={`font-serif font-normal italic text-violet ${className}`}>{children}</em>
}
