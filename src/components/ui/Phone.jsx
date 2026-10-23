export default function Phone({ src, alt, className = '', imgClassName = '' }) {
  return (
    <figure
      className={`overflow-hidden rounded-[32px] border-[7px] border-[#24242b] bg-[#0a0a0e] shadow-phone ${className}`}
    >
      <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${imgClassName}`} />
    </figure>
  )
}
