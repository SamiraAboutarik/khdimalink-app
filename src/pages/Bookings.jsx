import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, Star, CheckCircle, XCircle, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmé',    color: 'text-brand-green', bg: 'bg-brand-green/10',   icon: CheckCircle },
  pending:   { label: 'En attente',  color: 'text-amber-400',   bg: 'bg-amber-400/10',      icon: Loader },
  done:      { label: 'Terminé',     color: 'text-slate-400',   bg: 'bg-slate-400/10',      icon: CheckCircle },
  cancelled: { label: 'Annulé',      color: 'text-red-400',     bg: 'bg-red-400/10',        icon: XCircle },
}

const SAMPLE_BOOKINGS = [
  { id: 'b1', artisanName: 'Youssef El Fassi', service: 'Réparation fuite', date: '2025-06-10', time: '10:00', location: 'Hay Mohammadi', status: 'confirmed', price: '120 MAD' },
  { id: 'b2', artisanName: 'Ahmed Benali',     service: 'Diagnostic électrique', date: '2025-06-08', time: '14:00', location: 'Talborjt', status: 'done',      price: '150 MAD' },
  { id: 'b3', artisanName: 'Khalid Amrani',    service: 'Portail sur mesure', date: '2025-06-15', time: '09:00', location: 'Hay Salam',  status: 'pending',   price: '800 MAD' },
]

export default function Bookings() {
  const { bookings } = useApp()
  const navigate = useNavigate()

  const allBookings = [...SAMPLE_BOOKINGS, ...bookings.map(b => ({
    ...b, id: String(b.id), status: 'pending', price: 'À définir'
  }))]

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <h1 className="text-xl font-display font-bold text-white mb-1 animate-fadeInUp">Mes Réservations</h1>
        <p className="text-sm text-slate-400 mb-5 animate-fadeInUp anim-delay-1">{allBookings.length} réservations</p>

        <div className="space-y-4">
          {allBookings.map((b, i) => {
            const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
            const Icon = cfg.icon
            return (
              <div key={b.id} className={`glass rounded-2xl p-4 animate-fadeInUp anim-delay-${(i % 4)+1}`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{b.artisanName}</h3>
                    <p className="text-xs text-teal">{b.service}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                    <Icon size={11} />
                    {cfg.label}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar size={11} className="text-teal" /> {b.date}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={11} className="text-teal" /> {b.time}
                  </div>
                  {b.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 col-span-2">
                      <MapPin size={11} className="text-teal" /> {b.location}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-sm font-bold text-brand-orange">{b.price}</span>
                  {b.status === 'done' ? (
                    <button
                      onClick={() => navigate(`/rating/${b.artisanName}`)}
                      className="flex items-center gap-1.5 text-xs font-medium text-amber-400
                        border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 rounded-full hover:bg-amber-400/20 transition-all">
                      <Star size={11} fill="currentColor" /> Évaluer
                    </button>
                  ) : b.status === 'confirmed' ? (
                    <button
                      onClick={() => navigate('/chat')}
                      className="text-xs font-medium text-teal border border-teal/30 bg-teal/10
                        px-3 py-1.5 rounded-full hover:bg-teal/20 transition-all">
                      💬 Contacter
                    </button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
