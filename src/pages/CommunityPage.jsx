import { useMemo, useState } from 'react'
import FlashcardDeck from '../components/app/FlashcardDeck'
import Em from '../components/ui/Em'
import Icon from '../components/ui/Icon'
import Spinner from '../components/ui/Spinner'
import useAuth from '../hooks/useAuth'
import useCommunity from '../hooks/useCommunity'
import useHistory from '../hooks/useHistory'
import { isRemote } from '../services/communityApi'
import { formatDate } from '../utils/stats'

export default function CommunityPage() {
  const { user } = useAuth()
  const { history } = useHistory()
  const { decks, loading, error, reload, publish, like } = useCommunity()
  const [studying, setStudying] = useState(null)
  const [pickedId, setPickedId] = useState('')
  const [description, setDescription] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState('')
  const [liked, setLiked] = useState([])

  const myDecks = useMemo(() => history.filter((e) => e.type === 'flashcards'), [history])
  const picked = myDecks.find((d) => d.id === pickedId)

  async function handlePublish(e) {
    e.preventDefault()
    if (!picked) return
    setPublishing(true)
    setMessage('')
    try {
      await publish({ author: user.name.split(' ')[0], topic: picked.topic, description: description.trim() || `Flashcards sobre ${picked.topic}.`, cards: picked.data })
      setMessage('Baralho publicado na comunidade!')
      setPickedId('')
      setDescription('')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setPublishing(false)
    }
  }

  function handleLike(deck) {
    if (liked.includes(deck.id)) return
    setLiked((l) => [...l, deck.id])
    like(deck)
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Comunidade</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Estude <Em>junto.</Em></h1>
        </div>
        <span className={`rounded-full border px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider ${isRemote ? 'border-ok/30 bg-ok/10 text-ok' : 'border-line text-muted'}`}>
          {isRemote ? 'Conectado ao MockAPI' : 'Modo local (sem MockAPI)'}
        </span>
      </header>

      <form onSubmit={handlePublish} className="grid gap-4 rounded-3xl border border-line bg-surface p-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
        <div>
          <label className="label" htmlFor="deck">Publicar um dos meus flashcards</label>
          <select id="deck" className="field" value={pickedId} onChange={(e) => setPickedId(e.target.value)} disabled={!myDecks.length}>
            <option value="">{myDecks.length ? 'Escolha um baralho…' : 'Gere flashcards primeiro'}</option>
            {myDecks.map((d) => <option key={d.id} value={d.id}>{d.topic} ({d.data.length} cartões)</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="desc">Descrição (opcional)</label>
          <input id="desc" className="field" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={120} placeholder="Sobre o que é esse baralho?" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={!picked || publishing}>
          {publishing ? <><Spinner /> Publicando…</> : 'Publicar'}
        </button>
        {message && <p role="status" className="text-sm text-lime lg:col-span-3">{message}</p>}
      </form>

      {studying && (
        <div className="animate-pop space-y-5 rounded-3xl border border-violet/50 bg-surface p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{studying.topic}</h2>
              <p className="text-xs text-muted">por {studying.author}</p>
            </div>
            <button type="button" onClick={() => setStudying(null)} className="btn btn-ghost !min-h-9 !px-3 text-xs">Fechar</button>
          </div>
          <FlashcardDeck cards={studying.cards} key={studying.id} />
        </div>
      )}

      {error && (
        <p role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error} <button type="button" onClick={reload} className="underline">Tentar de novo</button>
        </p>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((k) => <div key={k} className="skeleton h-52 !rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <article key={deck.id} className="flex flex-col rounded-3xl border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-violet-bright/50">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-violet-bright">{deck.cards.length} cartões</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">{deck.topic}</h2>
              <p className="mt-2 flex-1 text-[0.8rem] leading-relaxed text-muted">{deck.description}</p>
              <p className="mt-4 text-xs text-muted">por {deck.author} · {formatDate(deck.createdAt)}</p>
              <div className="mt-4 flex items-center gap-3">
                <button type="button" onClick={() => setStudying(deck)} className="btn btn-primary !min-h-10 flex-1 text-xs">Estudar</button>
                <button
                  type="button"
                  onClick={() => handleLike(deck)}
                  aria-label={`Curtir ${deck.topic}`}
                  aria-pressed={liked.includes(deck.id)}
                  className={`flex min-h-10 items-center gap-2 rounded-[10px] border px-3 text-xs font-bold transition ${liked.includes(deck.id) ? 'border-lime/50 text-lime' : 'border-line text-muted hover:text-white'}`}
                >
                  <Icon name="heart" className="size-4" /> {deck.likes ?? 0}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
