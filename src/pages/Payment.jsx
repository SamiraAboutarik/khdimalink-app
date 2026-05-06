import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Banknote, CheckCircle, CreditCard, Loader, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Payment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { bookings, updateBookingStatus, showToast } = useApp()
  const [method, setMethod] = useState('cmi')
  const [loading, setLoading] = useState(false)
  const bookingId = searchParams.get('bookingId')
  const booking = bookings.find(item => String(item.id) === String(bookingId)) || bookings.find(item => item.status === 'accepted')

  const amount = booking?.amount || 250

  const pay = () => {
    if (!booking) return
    setLoading(true)
    window.setTimeout(() => {
      updateBookingStatus(booking.id, 'paid', {
        paymentStatus: 'paid',
        paymentMethod: method,
        paidAt: new Date().toISOString(),
      })
      showToast('Paiement confirme')
      navigate('/bookings', { replace: true })
    }, 2000)
  }

  if (!booking) {
    return (
      <div className="gradient-bg min-h-screen pb-20 pt-14">
        <div className="max-w-lg mx-auto px-4 pt-4">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white py-4 transition-colors">
            <ArrowLeft size={18} /> Retour
          </button>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-white font-semibold mb-2">Reservation introuvable</p>
            <button onClick={() => navigate('/bookings')} className="text-teal text-sm underline">
              Voir mes reservations
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white py-4 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Retour</span>
        </button>

        <div className="mb-5 animate-fadeInUp">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={20} className="text-teal" />
            <h1 className="text-xl font-display font-bold text-white">Paiement</h1>
          </div>
          <p className="text-sm text-slate-400">Reglez votre reservation en quelques secondes.</p>
        </div>

        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp">
          <h2 className="text-sm font-semibold text-white mb-3">Resume</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-slate-400">Prestataire</span>
              <span className="text-white text-right">{booking.artisanName}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-400">Service</span>
              <span className="text-white text-right">{booking.service_type || booking.service}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-400">Date</span>
              <span className="text-white text-right">{booking.date} a {booking.time_slot || booking.time}</span>
            </div>
            <div className="flex justify-between gap-3 border-t border-white/5 pt-3">
              <span className="text-slate-400">Montant</span>
              <span className="text-xl font-display font-bold text-brand-orange">{amount} MAD</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <button
            onClick={() => setMethod('cmi')}
            className={`w-full glass rounded-2xl p-4 text-left border transition-all ${method === 'cmi' ? 'border-teal/50' : 'border-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="text-teal" size={20} />
              <div>
                <p className="text-sm font-semibold text-white">CMI - carte bancaire marocaine</p>
                <p className="text-xs text-slate-400">Visa, Mastercard, banques marocaines</p>
              </div>
            </div>
          </button>

          {method === 'cmi' && (
            <div className="glass rounded-2xl p-4 space-y-3">
              <input placeholder="Numero de carte" maxLength={19}
                className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none border border-white/5 focus:border-teal/40" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM/AA" maxLength={5}
                  className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none border border-white/5 focus:border-teal/40" />
                <input placeholder="CVV" maxLength={3}
                  className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none border border-white/5 focus:border-teal/40" />
              </div>
            </div>
          )}

          <button
            onClick={() => setMethod('cash')}
            className={`w-full glass rounded-2xl p-4 text-left border transition-all ${method === 'cash' ? 'border-brand-green/50' : 'border-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Banknote className="text-brand-green" size={20} />
              <div>
                <p className="text-sm font-semibold text-white">Cash a la livraison</p>
                <p className="text-xs text-slate-400">Le paiement sera marque comme prepare.</p>
              </div>
            </div>
          </button>
        </div>

        <div className="glass rounded-xl p-3 mb-5 border border-teal/10 flex gap-2">
          <Shield size={16} className="text-teal shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Paiement simule en local pour la demo. Aucune donnee bancaire n'est envoyee.
          </p>
        </div>

        <button
          onClick={pay}
          disabled={loading}
          className="w-full gradient-orange py-4 rounded-xl font-bold text-white shadow-orange
            hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <><Loader size={18} className="animate-spin" /> Paiement...</> : <><CheckCircle size={18} /> Payer {amount} MAD</>}
        </button>
      </div>
    </div>
  )
}
