import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, Star, CheckCircle, XCircle, Loader } from 'lucide-react'
import { useApp } from '../context/AppContext'

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmé',   color: 'text-green-400',  bg: 'bg-green-400/10',  icon: CheckCircle },
  pending:   { label: 'En attente', color: 'text-amber-400',  bg: 'bg-amber-400/10',  icon: Loader      },
  done:      { label: 'Terminé',    color: 'text-slate-400',  bg: 'bg-slate-400/10',  icon: CheckCircle },
  cancelled: { label: 'Annulé',     color: 'text-red-400',    bg: 'bg-red-400/10',    icon: XCircle     },
}

export default function Bookings() {
  const { bookings } = useApp()
  const navigate = useNavigate()

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <h1 className="text-xl font-display font-bold text-white mb-1 animate-fadeInUp">Mes Réservations</h1>
        <p className="text-sm text-slate-400 mb-5 animate-fadeInUp anim-delay-1">
          {bookings.length} réservation{bookings.length !== 1 ? 's' : ''}
        </p>

        {bookings.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center animate-fadeInUp">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-white font-semibold mb-1">Aucune réservation</p>
            <p className="text-slate-400 text-sm mb-5">Trouvez un artisan et faites votre première réservation</p>
            <button onClick={() => navigate('/')}
              className="gradient-orange px-6 py-3 rounded-xl font-semibold text-white text-sm">
              Trouver un artisan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b, i) => {
              const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
              const Icon = cfg.icon
              // Nom de l'artisan : vient des donnees de reservation ou directement.
              const artisanName = b.artisans?.name || b.artisanName || '—'
              const serviceLabel = b.service_type || b.service || '—'
              const dateLabel = b.date || '—'
              const timeLabel = b.time_slot || b.time || '—'
              const locationLabel = b.location || ''
              const priceLabel = b.price_label || b.price || 'À définir'

              return (
                <div key={b.id}
                  className={`glass rounded-2xl p-4 animate-fadeInUp anim-delay-${(i % 4) + 1}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{artisanName}</h3>
                      <p className="text-xs text-teal">{serviceLabel}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <Icon size={11} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={11} className="text-teal" /> {dateLabel}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock size={11} className="text-teal" /> {timeLabel}
                    </div>
                    {locationLabel && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 col-span-2">
                        <MapPin size={11} className="text-teal" /> {locationLabel}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-sm font-bold text-brand-orange">{priceLabel}</span>
                    {b.status === 'done' ? (
                      <button
                        onClick={() => navigate(`/rating/${b.artisan_id || b.artisanId}`)}
                        className="flex items-center gap-1.5 text-xs font-medium text-amber-400
                          border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 rounded-full">
                        <Star size={11} fill="currentColor" /> Évaluer
                      </button>
                    ) : b.status === 'confirmed' ? (
                      <button onClick={() => navigate('/chat')}
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
        )}
      </div>
    </div>
  )
}
