import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { mockClients, mockProviders } from './adminMockData'
import { useAdminToast } from './AdminLayout'

const initialUsers = [
  ...mockClients,
  ...mockProviders.map(provider => ({
    id: `p-${provider.id}`,
    nom: provider.nom,
    phone: provider.phone,
    ville: provider.ville,
    role: 'prestataire',
    status: provider.status === 'Rejeté' ? 'Banni' : 'Actif',
    date: '2026-04-11',
  })),
]

export default function AdminUsers() {
  const showToast = useAdminToast()
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('Tous')

  const filteredUsers = useMemo(() => users.filter(user => {
    const matchesQuery = [user.nom, user.phone].some(value => value.toLowerCase().includes(query.toLowerCase()))
    const matchesRole = roleFilter === 'Tous' || user.role === roleFilter.toLowerCase()
    return matchesQuery && matchesRole
  }), [users, query, roleFilter])

  const toggleStatus = (id) => {
    setUsers(current => current.map(user => user.id === id
      ? { ...user, status: user.status === 'Banni' ? 'Actif' : 'Banni' }
      : user))
    showToast('Statut utilisateur mis à jour')
  }

  return (
    <section className="glass rounded-2xl p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Utilisateurs</h1>
          <p className="text-sm text-slate-400">Gestion des clients et prestataires.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nom ou téléphone" className="glass rounded-xl py-2 pl-9 pr-3 text-sm text-white outline-none" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="glass rounded-xl px-3 py-2 text-sm text-white outline-none">
            {['Tous', 'Client', 'Prestataire'].map(role => <option key={role}>{role}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs text-slate-400">
            <tr>
              {['Nom', 'Téléphone', 'Ville', 'Rôle', 'Statut', 'Date inscription', 'Actions'].map(head => <th key={head} className="px-3 py-2">{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className={`${index % 2 ? 'bg-white/5' : ''} ${user.status === 'Banni' ? 'bg-red-500/10 text-red-400' : 'hover:bg-teal/5'}`}>
                <td className="px-3 py-2 font-semibold text-white">{user.nom}</td>
                <td className="px-3 py-2 text-slate-400">{user.phone}</td>
                <td className="px-3 py-2 text-slate-400">{user.ville}</td>
                <td className="px-3 py-2 text-slate-400 capitalize">{user.role}</td>
                <td className="px-3 py-2">{user.status}</td>
                <td className="px-3 py-2 text-slate-400">{user.date}</td>
                <td className="px-3 py-2">
                  <button onClick={() => toggleStatus(user.id)} className="rounded-full border border-teal/30 px-3 py-1 text-xs font-semibold text-teal hover:bg-teal/10">
                    {user.status === 'Banni' ? 'Activer' : 'Bannir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
