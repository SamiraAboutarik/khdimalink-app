import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react'
import artisans from '../data/artisans.json'
import { useApp } from '../context/AppContext'

const TIME_SLOTS = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00']
const SERVICES  = ['Diagnostic','Réparation','Installation','Entretien','Urgence']

export default function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addBooking } = useApp()
  const artisan = artisans.find(a => a.id === Number(id))

  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('')
  const [service, setService] = useState('')
  const [location, setLocation] = useState('')
  const [note, setNote] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  if (!artisan) return null

  const handleConfirm = () => {
    if (!date || !time || !service) return
    addBooking({ artisanId: artisan.id, artisanName: artisan.name, date, time, service, location, note })
    setConfirmed(true)
  }

  if (confirmed) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 text-center max-w-sm w-full animate-fadeInUp">
        <div className="w-16 h-16 gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-2">Réservation confirmée !</h2>
        <p className="text-slate-400 text-sm mb-1">
          <span className="text-teal font-medium">{artisan.name}</span> — {service}
        </p>
        <p className="text-slate-400 text-sm mb-6">
          📅 {date} à {time}
        </p>
        <button onClick={() => navigate('/')}
          className="w-full gradient-orange py-3 rounded-xl font-semibold text-white shadow-orange">
          Retour à l'accueil
        </button>
        <button onClick={() => navigate('/chat')}
          className="w-full mt-3 glass py-3 rounded-xl text-sm text-teal">
          Contacter l'artisan
        </button>
      </div>
    </div>
  )

  return (
    <div className="gradient-bg min-h-screen pb-24 pt-14">
      <div className="max-w-lg mx-auto px-4">
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white py-4 transition-colors">
          <ArrowLeft size={18} /> <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-xl font-display font-bold text-white mb-1 animate-fadeInUp">Réserver un service</h1>
        <p className="text-sm text-slate-400 mb-5 animate-fadeInUp anim-delay-1">
          avec <span className="text-teal">{artisan.name}</span>
        </p>

        {/* Date */}
        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <Calendar size={15} className="text-teal" /> Date d'intervention
          </label>
          <input type="date" value={date} min={today}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white outline-none
              border border-white/5 focus:border-teal/40 transition-all" />
        </div>

        {/* Time */}
        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <Clock size={15} className="text-teal" /> Heure
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map(t => (
              <button key={t} onClick={() => setTime(t)}
                className={`py-2 rounded-xl text-sm font-medium transition-all
                  ${time === t
                    ? 'gradient-teal text-white shadow-glow'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Service type */}
        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-3">
          <label className="text-sm font-semibold text-white mb-3 block">Type de service</label>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map(s => (
              <button key={s} onClick={() => setService(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${service === s
                    ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/40'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
            <MapPin size={15} className="text-teal" /> Adresse
          </label>
          <input type="text" value={location} placeholder="Ex: Hay Mohammadi, Agadir"
            onChange={e => setLocation(e.target.value)}
            className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500
              outline-none border border-white/5 focus:border-teal/40 transition-all" />
        </div>

        {/* Note */}
        <div className="glass rounded-2xl p-4 mb-6 animate-fadeInUp anim-delay-5">
          <label className="text-sm font-semibold text-white mb-3 block">Note (optionnel)</label>
          <textarea rows={3} value={note} placeholder="Décrivez votre problème..."
            onChange={e => setNote(e.target.value)}
            className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500
              outline-none border border-white/5 focus:border-teal/40 transition-all resize-none" />
        </div>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          disabled={!date || !time || !service}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all
            ${date && time && service
              ? 'gradient-orange shadow-orange hover:opacity-90 hover:scale-[1.02]'
              : 'bg-slate-700 cursor-not-allowed text-slate-500'}`}>
          Confirmer la réservation
        </button>
      </div>
    </div>
  )
}
