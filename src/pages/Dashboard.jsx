import { AlertCircle, Briefcase, CheckCircle, Clock, Star, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Dashboard() {
  const { user, bookings, updateBookingStatus, showToast } = useApp()
  const pendingBookings = bookings.filter(booking => booking.status === 'pending')
  const activeBookings = bookings.filter(booking => booking.status === 'accepted' || booking.status === 'paid')
  const completedBookings = bookings.filter(booking => booking.status === 'completed')

  const setStatus = (bookingId, status) => {
    updateBookingStatus(bookingId, status)
    const messages = {
      accepted: 'Reservation acceptee',
      declined: 'Reservation refusee',
      completed: 'Reservation terminee',
    }
    showToast(messages[status] || 'Statut mis a jour')
  }

  const stats = [
    { label: 'Ce mois', value: `${completedBookings.reduce((sum, booking) => sum + Number(booking.amount || 0), 0)} MAD`, sub: 'mock', icon: TrendingUp, color: 'text-brand-green', bg: 'bg-brand-green/10' },
    { label: 'Missions', value: bookings.length, sub: 'total', icon: Briefcase, color: 'text-teal', bg: 'bg-teal/10' },
    { label: 'Actives', value: activeBookings.length, sub: 'en cours', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'En attente', value: pendingBookings.length, sub: 'demandes', icon: Clock, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
  ]

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="mb-5 animate-fadeInUp">
          <p className="text-slate-400 text-sm">Tableau de bord</p>
          <h1 className="text-xl font-display font-bold text-white">
            Bonjour {user?.name?.split(' ')[0] || 'Prestataire'}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`glass rounded-2xl p-4 animate-fadeInUp anim-delay-${i + 1}`}>
              <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center mb-2.5`}>
                <stat.icon size={15} className={stat.color} />
              </div>
              <p className="text-xl font-display font-bold text-white">{stat.value}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-slate-400">{stat.label}</span>
                <span className={`text-[10px] font-medium ${stat.color}`}>{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5 animate-fadeInUp anim-delay-3">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertCircle size={15} className="text-brand-orange" />
            Demandes en attente
          </h2>
          {pendingBookings.length === 0 ? (
            <div className="glass rounded-xl p-4 text-sm text-slate-400">Aucune demande en attente.</div>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((booking, i) => (
                <div key={booking.id} className={`glass rounded-xl p-4 flex items-center gap-3
                  animate-fadeInUp anim-delay-${i + 1}`}>
                  <div className="w-2 h-2 rounded-full shrink-0 bg-brand-orange" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{booking.service_type || booking.service}</p>
                    <p className="text-xs text-teal">{booking.date} a {booking.time_slot || booking.time}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{booking.location}</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => setStatus(booking.id, 'accepted')}
                      className="text-xs px-3 py-1.5 gradient-teal text-white rounded-lg font-medium shadow-glow
                        hover:opacity-90 transition-all">
                      Accepter
                    </button>
                    <button
                      onClick={() => setStatus(booking.id, 'declined')}
                      className="text-xs px-3 py-1.5 bg-white/5 text-slate-400 rounded-lg hover:bg-white/10 transition-all">
                      Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="animate-fadeInUp anim-delay-4">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle size={15} className="text-brand-green" />
            Missions actives
          </h2>
          {activeBookings.length === 0 ? (
            <div className="glass rounded-xl p-4 text-sm text-slate-400">Aucune mission active.</div>
          ) : (
            <div className="space-y-3">
              {activeBookings.map((booking, i) => (
                <div key={booking.id} className={`glass rounded-xl p-4 flex items-center gap-3 animate-fadeInUp anim-delay-${i + 1}`}>
                  <div className="w-9 h-9 gradient-teal rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm">
                    {(booking.service_type || 'M')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{booking.service_type || booking.service}</p>
                    <p className="text-xs text-slate-400">{booking.date} a {booking.time_slot || booking.time}</p>
                    {booking.status === 'paid' && <p className="text-[10px] text-brand-green">Paiement recu</p>}
                  </div>
                  <button
                    onClick={() => setStatus(booking.id, 'completed')}
                    className="text-xs px-3 py-1.5 bg-brand-green/10 text-brand-green rounded-lg hover:bg-brand-green/20 transition-all">
                    Terminer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
