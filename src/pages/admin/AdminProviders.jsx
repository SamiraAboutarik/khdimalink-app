import { useMemo, useState } from 'react'
import { mockProviders } from './adminMockData'
import { useAdminToast } from './AdminLayout'

const statusClass = {
  'En attente': 'bg-amber-400/15 text-amber-400',
  'Approuvé': 'bg-brand-green/15 text-brand-green',
  'Rejeté': 'bg-red-500/15 text-red-400',
}

export default function AdminProviders() {
  const showToast = useAdminToast()
  const [providers, setProviders] = useState(mockProviders)
  const [statusFilter, setStatusFilter] = useState('Tous')

  const filteredProviders = useMemo(() => providers.filter(provider => (
    statusFilter === 'Tous' || provider.status === statusFilter
  )), [providers, statusFilter])

  const updateStatus = (id, status) => {
    setProviders(current => current.map(provider => provider.id === id ? { ...provider, status } : provider))
    showToast(`Prestataire ${status.toLowerCase()} avec succès`)
  }

  return (
    <section className="glass rounded-2xl p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Prestataires</h1>
          <p className="text-sm text-slate-400">Approbation et modération des comptes.</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="glass rounded-xl px-3 py-2 text-sm text-white outline-none">
          {['Tous', 'En attente', 'Approuvé', 'Rejeté'].map(status => <option key={status}>{status}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs text-slate-400">
            <tr>
              {['Nom', 'Catégorie', 'Ville', 'Téléphone', 'Statut', 'Actions'].map(head => <th key={head} className="px-3 py-2">{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredProviders.map((provider, index) => (
              <tr key={provider.id} className={`${index % 2 ? 'bg-white/5' : ''} hover:bg-teal/5`}>
                <td className="px-3 py-2 font-semibold text-white">{provider.nom}</td>
                <td className="px-3 py-2 text-slate-400 capitalize">{provider.categorie}</td>
                <td className="px-3 py-2 text-slate-400">{provider.ville}</td>
                <td className="px-3 py-2 text-slate-400">{provider.phone}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[provider.status]}`}>
                    {provider.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {provider.status === 'En attente' ? (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(provider.id, 'Approuvé')} className="rounded-full bg-brand-green/15 px-3 py-1 text-xs font-semibold text-brand-green hover:bg-brand-green/25">Approuver</button>
                      <button onClick={() => updateStatus(provider.id, 'Rejeté')} className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/25">Rejeter</button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Aucune action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
