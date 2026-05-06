import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, CheckCircle, Clock, CreditCard, Loader, MapPin, MessageCircle, Star, XCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Loader },
  accepted: { label: 'Acceptee', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: CheckCircle },
  completed: { label: 'Terminee', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
  declined: { label: 'Refusee', color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
  cancelled: { label: 'Annulee', color: 'text-gray-400', bg: 'bg-gray-400/10', icon: XCircle },
  paid: { label: 'Payee', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
}

export default function Bookings() {
  const { bookings, cancelBooking } = useApp()
  const navigate = useNavigate()
  const [bookingToCancel, setBookingToCancel] = useState(null)

  const confirmCancel = () => {
    if (!bookingToCancel) return
    cancelBooking(bookingToCancel.id)
    setBookingToCancel(null)
  }

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <h1 className="text-xl font-display font-bold text-white mb-1 animate-fadeInUp">Mes Reservations</h1>
        <p className="text-sm text-slate-400 mb-5 animate-fadeInUp anim-delay-1">
          {bookings.length} reservation{bookings.length !== 1 ? 's' : ''}
        </p>

        {bookings.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center animate-fadeInUp">
            <p className="text-4xl mb-3">...</p>
            <p className="text-white font-semibold mb-1">Aucune reservation</p>
            <p className="text-slate-400 text-sm mb-5">Trouvez un artisan et faites votre premiere reservation</p>
            <button onClick={() => navigate('/')}
              className="gradient-orange px-6 py-3 rounded-xl font-semibold text-white text-sm">
              Trouver un artisan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => {
              const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
              const Icon = cfg.icon
              const artisanName = booking.artisans?.name || booking.artisanName || 'Prestataire'
              const serviceLabel = booking.service_type || booking.service || 'Service'
              const dateLabel = booking.date || '-'
              const timeLabel = booking.time_slot || booking.time || '-'
              const locationLabel = booking.location || ''
              const priceLabel = booking.price_label || booking.price || `${booking.amount || 250} MAD`
              const canCancel = booking.status === 'pending' || booking.status === 'accepted'
              const canPay = booking.status === 'accepted'
              const isPaid = booking.status === 'paid' || booking.paymentStatus === 'paid'

              return (
                <div key={booking.id}
                  className={`glass rounded-2xl p-4 animate-fadeInUp anim-delay-${(i % 4) + 1}`}>
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate">{artisanName}</h3>
                      <p className="text-xs text-teal">{serviceLabel}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <Icon size={11} />
                      {cfg.label}
                    </span>
                  </div>

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

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
                    <span className="text-sm font-bold text-brand-orange shrink-0">{priceLabel}</span>
                    <div className="flex flex-wrap justify-end gap-2">
                      {isPaid && (
                        <span className="text-xs font-medium text-green-400 border border-green-400/30 bg-green-400/10 px-3 py-1.5 rounded-full">
                          Paye
                        </span>
                      )}
                      {booking.status === 'completed' && (
                        <button
                          onClick={() => navigate(`/rating/${booking.artisan_id || booking.artisanId}`)}
                          className="flex items-center gap-1.5 text-xs font-medium text-amber-400
                            border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 rounded-full">
                          <Star size={11} fill="currentColor" /> Evaluer
                        </button>
                      )}
                      {canPay && (
                        <button
                          onClick={() => navigate(`/payment?bookingId=${booking.id}`)}
                          className="flex items-center gap-1.5 text-xs font-medium text-teal border border-teal/30 bg-teal/10
                            px-3 py-1.5 rounded-full hover:bg-teal/20 transition-all">
                          <CreditCard size={11} /> Payer maintenant
                        </button>
                      )}
                      {(booking.status === 'accepted' || booking.status === 'paid') && (
                        <button onClick={() => navigate(`/chat?bookingId=${booking.id}`)}
                          className="flex items-center gap-1.5 text-xs font-medium text-teal border border-teal/30 bg-teal/10
                            px-3 py-1.5 rounded-full hover:bg-teal/20 transition-all">
                          <MessageCircle size={11} /> Contacter
                        </button>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => setBookingToCancel(booking)}
                          className="text-xs font-medium text-red-400 border border-red-400/30 bg-red-400/10
                            px-3 py-1.5 rounded-full hover:bg-red-400/20 transition-all">
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {bookingToCancel && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4">
          <div className="glass w-full max-w-sm rounded-2xl p-5 text-center">
            <h2 className="text-lg font-display font-bold text-white mb-2">Confirmer l'annulation ?</h2>
            <p className="text-sm text-slate-400 mb-5">{bookingToCancel.artisanName}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setBookingToCancel(null)}
                className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-semibold text-slate-300"
              >
                Garder
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 rounded-xl bg-red-500/20 py-3 text-sm font-semibold text-red-300"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
