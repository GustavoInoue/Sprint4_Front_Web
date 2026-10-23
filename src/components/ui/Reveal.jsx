import useInView from '../../hooks/useInView'

/** Anima a entrada do conteúdo quando ele aparece na tela. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
