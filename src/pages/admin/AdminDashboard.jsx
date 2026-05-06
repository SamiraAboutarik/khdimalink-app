import { CheckCircle, Clock, DollarSign, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { mockBookings, mockClients, mockProviders } from './adminMockData'
import { useAdminToast } from './AdminLayout'

const statusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  done: 'Terminée',
  cancelled: 'Annulée',
}

export default function AdminDashboard() {
  const { bookings } = useApp()
  const showToast = useAdminToast()
  const allBookings = bookings.length ? bookings : mockBookings
  const pendingProviders = mockProviders.filter(provider => provider.status === 'En attente')
  const revenue = allBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0)

  const stats = [
    { label: 'Total utilisateurs', value: mockClients.length, icon: Users, color: 'text-teal', bg: 'bg-teal/10' },
    { label: 'Total prestataires', value: mockProviders.length, icon: CheckCircle, color: 'text-brand-green', bg: 'bg-brand-green/10' },
    { label: 'Total réservations', value: allBookings.length, icon: Clock, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
    { label: 'Revenus simulés', value: `${revenue} MAD`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-display font-bold text-white">Dashboard admin</h1>
        <p className="text-sm text-slate-400">Vue globale de la marketplace.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-2xl p-4">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
              <Icon size={17} className={color} />
            </div>
            <p className="text-2xl font-display font-bold text-white">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <section className="glass rounded-2xl p-4">
          <h2 className="mb-3 text-sm font-semibold text-white">Réservations récentes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs text-slate-400">
                <tr>
                  <th className="px-3 py-2">Client</th>
                  <th className="px-3 py-2">Prestataire</th>
                  <th className="px-3 py-2">Service</th>
                  <th className="px-3 py-2">Statut</th>
                  <th className="px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.slice(0, 5).map((booking, index) => (
                  <tr key={booking.id} className={`${index % 2 ? 'bg-white/5' : ''} hover:bg-teal/5`}>
                    <td className="px-3 py-2 text-white">{booking.client || 'Client'}</td>
                    <td className="px-3 py-2 text-slate-400">{booking.provider || booking.artisanName || 'Prestataire'}</td>
                    <td className="px-3 py-2 text-slate-400">{booking.service || booking.service_type}</td>
                    <td className="px-3 py-2 text-teal">{statusLabels[booking.status] || booking.status}</td>
                    <td className="px-3 py-2 text-slate-400">{booking.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass rounded-2xl p-4">
          <h2 className="mb-2 text-sm font-semibold text-white">Prestataires en attente</h2>
          <p className="mb-4 text-3xl font-display font-bold text-brand-orange">{pendingProviders.length}</p>
          <button
            onClick={() => showToast('Prestataires approuvés avec succès')}
            className="w-full rounded-xl bg-brand-green/15 px-4 py-3 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/25"
          >
            Approuver rapidement
          </button>
        </section>
      </div>
    </div>
  )
}
