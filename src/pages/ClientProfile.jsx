import { useNavigate } from 'react-router-dom'
import { Calendar, Heart, LogOut, MapPin, Phone, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import artisans from '../data/artisans.json'

export default function ClientProfile() {
  const { user, bookings, logout } = useApp()
  const navigate = useNavigate()
  const savedProviders = artisans.slice(0, 3)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="glass rounded-2xl p-5 mb-4 animate-fadeInUp">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 gradient-teal rounded-2xl flex items-center justify-center text-3xl font-bold text-white shrink-0">
              {user?.name?.[0] || 'C'}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 mb-1">Profil client</p>
              <h1 className="text-lg font-display font-bold text-white truncate">
                {user?.name || 'Client KhdimaLink'}
              </h1>
              <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                <Phone size={13} className="text-teal" /> {user?.phone || '06 12 34 56 78'}
              </p>
              <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin size={13} className="text-teal" /> {user?.city || 'Agadir'}
              </p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-1">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <User size={15} className="text-teal" /> Informations personnelles
          </h2>
          <div className="space-y-3">
            {[
              ['Nom complet', user?.name || 'Client KhdimaLink'],
              ['Numero de telephone', user?.phone || '06 12 34 56 78'],
              ['Ville', user?.city || 'Agadir'],
              ['Photo de profil', 'Initiale du compte'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-xs text-slate-400">{label}</span>
                <span className="text-sm font-medium text-white text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-2">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Calendar size={15} className="text-teal" /> Historique des demandes
          </h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-slate-400">Aucune demande pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 4).map(booking => (
                <div key={booking.id} className="bg-white/5 rounded-xl p-3">
                  <p className="text-sm font-semibold text-white">{booking.artisanName || 'Prestataire'}</p>
                  <p className="text-xs text-slate-400">{booking.service_type} - {booking.date} a {booking.time_slot}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-4 mb-5 animate-fadeInUp anim-delay-3">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Heart size={15} className="text-teal" /> Prestataires favoris
          </h2>
          <div className="space-y-3">
            {savedProviders.map(provider => (
              <button
                key={provider.id}
                onClick={() => navigate(`/artisan/${provider.id}`)}
                className="w-full flex items-center gap-3 bg-white/5 rounded-xl p-3 text-left hover:bg-white/10 transition-colors"
              >
                <img src={provider.avatar} alt={provider.name} className="w-10 h-10 rounded-xl bg-navy-700" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{provider.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{provider.category} - {provider.city}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
            border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all
            font-medium text-sm animate-fadeInUp anim-delay-4"
        >
          <LogOut size={16} />
          Se deconnecter
        </button>
      </div>
    </div>
  )
}
