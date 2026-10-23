import useContactForm from '../../hooks/useContactForm'
import { isRemote } from '../../services/communityApi'
import Reveal from '../ui/Reveal'
import Spinner from '../ui/Spinner'

const inputCls =
  'w-full resize-y rounded-[10px] border border-line bg-[#15151c] p-4 text-[0.8rem] normal-case tracking-normal text-white outline-none transition placeholder:text-[#615e68] focus:border-violet-bright focus:ring-4 focus:ring-violet/20'
const labelCls = 'mb-5 grid gap-2 text-[0.64rem] font-bold uppercase tracking-[0.05em] text-[#aaa6b2]'

export default function Contact() {
  const { values, status, onChange, onSubmit } = useContactForm()

  return (
    <section id="contato" className="relative scroll-mt-20 overflow-hidden bg-violet py-24 lg:py-[135px]" aria-labelledby="contact-title">
      <span className="pointer-events-none absolute -bottom-10 -right-10 select-none text-[18vw] font-black leading-none tracking-[-0.08em] text-white/[0.055]" aria-hidden="true">
        CODECAM
      </span>
      <div className="relative z-[2] mx-auto grid w-[min(1180px,calc(100%-32px))] gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
        <Reveal>
          <p className="eyebrow !text-lavender">Contato</p>
          <h2 id="contact-title" className="text-[clamp(3rem,5.5vw,5.4rem)] font-semibold">Vamos conversar sobre o futuro do estudo?</h2>
          <p className="my-7 max-w-[470px] text-white/75">
            Conheça mais sobre a pesquisa, o processo e as decisões que deram forma ao CodeCam.
          </p>
          <address className="grid gap-2 not-italic">
            <a href="mailto:equipe.codecam@email.com" className="font-bold underline underline-offset-4">equipe.codecam@email.com</a>
            <span className="text-[0.7rem] text-white/60">Projeto acadêmico desenvolvido para JOVI</span>
          </address>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={onSubmit} className="rounded-[36px] border border-white/20 bg-ink/90 p-7 shadow-[0_40px_90px_rgba(35,20,95,.36)] sm:p-12">
            <div className="grid gap-x-5 sm:grid-cols-2">
              <label className={labelCls}>
                Seu nome
                <input className={inputCls} name="name" value={values.name} onChange={onChange} placeholder="Como podemos te chamar?" required />
              </label>
              <label className={labelCls}>
                Seu e-mail
                <input className={inputCls} type="email" name="email" value={values.email} onChange={onChange} placeholder="nome@email.com" required />
              </label>
            </div>
            <label className={labelCls}>
              Mensagem
              <textarea className={inputCls} name="message" rows={5} value={values.message} onChange={onChange} placeholder="Conte um pouco sobre o que gostaria de saber..." required />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={status === 'sending'} className="btn btn-light">
                {status === 'sending' ? <><Spinner /> Enviando...</> : <>Enviar mensagem <span aria-hidden="true">↗</span></>}
              </button>
              <p className="text-[0.6rem] text-[#66636e]">
                {isRemote ? 'Sua mensagem é salva via API (MockAPI).' : 'Formulário demonstrativo para apresentação da Challenge.'}
              </p>
            </div>
            <div role="status" aria-live="polite" className="mt-5 min-h-6 text-sm">
              {status === 'success' && (
                <p className="flex animate-pop items-center gap-2 font-bold text-lime">
                  <span className="grid size-6 place-items-center rounded-full bg-lime text-xs text-ink" aria-hidden="true">✓</span> Sua mensagem foi enviada!
                </p>
              )}
              {status === 'error' && <p className="text-danger">Não foi possível enviar agora. Tente novamente.</p>}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
