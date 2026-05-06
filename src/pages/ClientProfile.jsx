import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Edit2, Heart, Home, LogOut, MapPin, Phone, Plus, Trash2, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import artisans from '../data/artisans.json'
import ArtisanCard from '../components/ArtisanCard'

const EMPTY_ADDRESS = { label: 'Maison', text: '', city: 'Agadir' }

export default function ClientProfile() {
  const { user, bookings, logout, favorites, addresses, saveAddress, deleteAddress } = useApp()
  const navigate = useNavigate()
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS)
  const [editingId, setEditingId] = useState(null)
  const savedProviders = artisans.filter(provider => favorites.includes(String(provider.id)))

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const submitAddress = event => {
    event.preventDefault()
    if (!addressForm.text.trim() || !addressForm.city.trim()) return
    saveAddress({ ...addressForm, id: editingId })
    setAddressForm(EMPTY_ADDRESS)
    setEditingId(null)
  }

  const editAddress = address => {
    setEditingId(address.id)
    setAddressForm({ label: address.label, text: address.text, city: address.city })
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
            <Home size={15} className="text-teal" /> Mes adresses
          </h2>
          <form onSubmit={submitAddress} className="space-y-3 mb-4">
            <div className="grid grid-cols-[0.8fr_1fr] gap-2">
              <select
                value={addressForm.label}
                onChange={event => setAddressForm(form => ({ ...form, label: event.target.value }))}
                className="bg-white/5 rounded-xl px-3 py-2.5 text-sm text-white outline-none border border-white/5"
              >
                <option>Maison</option>
                <option>Travail</option>
                <option>Autre</option>
              </select>
              <input
                value={addressForm.city}
                onChange={event => setAddressForm(form => ({ ...form, city: event.target.value }))}
                placeholder="Ville"
                className="bg-white/5 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none border border-white/5"
              />
            </div>
            <input
              value={addressForm.text}
              onChange={event => setAddressForm(form => ({ ...form, text: event.target.value }))}
              placeholder="Adresse complete"
              className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none border border-white/5"
            />
            <button className="w-full gradient-teal rounded-xl py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2">
              <Plus size={15} /> {editingId ? 'Modifier adresse' : 'Ajouter adresse'}
            </button>
          </form>

          <div className="space-y-2">
            {addresses.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune adresse sauvegardee.</p>
            ) : addresses.map(address => (
              <div key={address.id} className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
                <MapPin size={15} className="text-teal shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{address.label}</p>
                  <p className="text-xs text-slate-400">{address.text}, {address.city}</p>
                </div>
                <button onClick={() => editAddress(address)} className="p-2 rounded-lg text-slate-400 hover:text-teal hover:bg-white/5">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => deleteAddress(address.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-3">
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

        <div className="mb-5 animate-fadeInUp anim-delay-4">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Heart size={15} className="text-teal" /> Prestataires favoris
          </h2>
          {savedProviders.length === 0 ? (
            <div className="glass rounded-2xl p-5 text-center">
              <p className="text-sm text-slate-400">Aucun prestataire favori.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProviders.map((provider, index) => (
                <ArtisanCard key={provider.id} artisan={provider} delay={index % 3} />
              ))}
            </div>
          )}
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
