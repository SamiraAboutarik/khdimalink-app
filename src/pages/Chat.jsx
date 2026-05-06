import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Phone, Send, Video } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const formatTime = (value) => new Date(value).toLocaleTimeString('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
})

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { bookings, getThread, sendChatMessage, markThreadRead, chatThreads } = useApp()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const activeBookingId = searchParams.get('bookingId')
  const activeBooking = bookings.find(booking => String(booking.id) === String(activeBookingId))
  const activeThread = activeBookingId ? getThread(activeBookingId) : null

  const contacts = useMemo(() => (
    bookings
      .filter(booking => ['accepted', 'paid', 'completed'].includes(booking.status))
      .map(booking => {
        const thread = chatThreads.find(item => String(item.bookingId) === String(booking.id))
        const lastMessage = thread?.messages?.[thread.messages.length - 1]
        return { booking, thread, lastMessage }
      })
  ), [bookings, chatThreads])

  useEffect(() => {
    if (activeBookingId) markThreadRead(activeBookingId)
  }, [activeBookingId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeThread?.messages?.length, activeBookingId])

  const send = () => {
    if (!input.trim() || !activeBookingId) return
    sendChatMessage(activeBookingId, input.trim())
    setInput('')
  }

  if (activeBooking && activeThread) {
    const messages = activeThread.messages || []

    return (
      <div className="gradient-bg min-h-screen flex flex-col pt-14 pb-0 max-w-lg mx-auto">
        <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSearchParams({})} className="text-slate-400 hover:text-white">
            <ArrowLeft size={18} />
          </button>
          <img
            src={activeBooking.artisanAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeBooking.artisanName}`}
            alt=""
            className="w-9 h-9 rounded-full bg-navy-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{activeBooking.artisanName}</p>
            <p className="text-[10px] text-brand-green flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green inline-block" />
              Reservation {activeBooking.status}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 glass rounded-lg text-teal hover:text-white transition-colors"><Phone size={15} /></button>
            <button className="p-2 glass rounded-lg text-teal hover:text-white transition-colors"><Video size={15} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {messages.length === 0 && (
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-sm text-slate-400">Demarrez la conversation avec votre prestataire.</p>
            </div>
          )}
          {messages.map(message => {
            const mine = message.sender === 'client'
            return (
              <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm
                  ${mine ? 'gradient-teal text-white rounded-br-sm' : 'glass text-slate-200 rounded-bl-sm'}`}>
                  {message.text}
                  <div className={`text-[10px] mt-1 ${mine ? 'text-white/60' : 'text-slate-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        <div className="glass border-t border-white/5 px-4 py-3 flex items-center gap-3 fixed bottom-20 left-0 right-0 max-w-lg mx-auto">
          <input
            type="text"
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => event.key === 'Enter' && send()}
            placeholder="Ecrire un message..."
            className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500
              outline-none border border-white/5 focus:border-teal/40 transition-all"
          />
          <button onClick={send}
            className="w-10 h-10 gradient-teal rounded-xl flex items-center justify-center shadow-glow
              hover:opacity-90 transition-all shrink-0">
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <h1 className="text-xl font-display font-bold text-white mb-5 animate-fadeInUp">Messages</h1>
        {contacts.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-sm text-slate-400">Aucune conversation. Une reservation acceptee ouvrira un fil de discussion.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map(({ booking, thread, lastMessage }, i) => (
              <button
                key={booking.id}
                onClick={() => setSearchParams({ bookingId: booking.id })}
                className={`w-full glass rounded-2xl p-4 flex items-center gap-3 hover:border-teal/30 transition-all
                  animate-fadeInUp anim-delay-${i + 1}`}
              >
                <div className="relative shrink-0">
                  <img
                    src={booking.artisanAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${booking.artisanName}`}
                    alt=""
                    className="w-12 h-12 rounded-full bg-navy-700"
                  />
                  {(thread?.unread || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-brand-orange text-[10px] font-bold text-white flex items-center justify-center">
                      {thread.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white truncate">{booking.artisanName}</p>
                    <p className="text-[10px] text-slate-500">{lastMessage ? formatTime(lastMessage.timestamp) : booking.date}</p>
                  </div>
                  <p className="text-xs text-teal mb-0.5">{booking.service_type || booking.service}</p>
                  <p className="text-xs text-slate-400 truncate">{lastMessage?.text || 'Aucun message pour le moment.'}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
