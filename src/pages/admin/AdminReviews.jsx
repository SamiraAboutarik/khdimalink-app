import { useMemo, useState } from 'react'
import StarRating from '../../components/StarRating'
import { mockReviews } from './adminMockData'
import { useAdminToast } from './AdminLayout'

export default function AdminReviews() {
  const showToast = useAdminToast()
  const [reviews, setReviews] = useState(mockReviews)
  const [filter, setFilter] = useState('Tous')

  const filteredReviews = useMemo(() => reviews.filter(review => (
    filter === 'Tous' || review.status === filter
  )), [reviews, filter])

  const updateStatus = (id, status) => {
    setReviews(current => current.map(review => review.id === id ? { ...review, status } : review))
    showToast(status === 'Supprimé' ? 'Avis supprimé' : 'Avis approuvé')
  }

  return (
    <section className="glass rounded-2xl p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Avis</h1>
          <p className="text-sm text-slate-400">Modération des commentaires clients.</p>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="glass rounded-xl px-3 py-2 text-sm text-white outline-none">
          {['Tous', 'En attente', 'Approuvé', 'Supprimé'].map(status => <option key={status}>{status}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs text-slate-400">
            <tr>
              {['Client', 'Prestataire', 'Note', 'Commentaire', 'Date', 'Statut', 'Actions'].map(head => <th key={head} className="px-3 py-2">{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review, index) => (
              <tr key={review.id} className={`${index % 2 ? 'bg-white/5' : ''} hover:bg-teal/5 ${review.status === 'Supprimé' ? 'line-through opacity-60' : ''}`}>
                <td className="px-3 py-2 font-semibold text-white">{review.client}</td>
                <td className="px-3 py-2 text-slate-400">{review.provider}</td>
                <td className="px-3 py-2"><StarRating rating={review.rating} size={12} /></td>
                <td className="max-w-xs px-3 py-2 text-slate-400">{review.comment}</td>
                <td className="px-3 py-2 text-slate-400">{review.date}</td>
                <td className="px-3 py-2 text-teal">{review.status}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(review.id, 'Approuvé')} className="rounded-full bg-brand-green/15 px-3 py-1 text-xs font-semibold text-brand-green hover:bg-brand-green/25">
                      Approuver
                    </button>
                    <button onClick={() => updateStatus(review.id, 'Supprimé')} className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/25">
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
