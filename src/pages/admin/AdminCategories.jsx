import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import baseCategories from '../../data/categories.json'
import { useAdminToast } from './AdminLayout'

const ICONS = ['🔧', '⚡', '🪚', '🎨', '🧹', '🌿', '🛠️']

export default function AdminCategories() {
  const showToast = useAdminToast()
  const [categories, setCategories] = useState(baseCategories.map(category => ({ ...category, labelAr: category.label })))
  const [form, setForm] = useState({ label: '', labelAr: '', icon: ICONS[0] })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const addCategory = (e) => {
    e.preventDefault()
    if (!form.label.trim() || !form.labelAr.trim()) return
    setCategories(current => [...current, {
      id: form.label.toLowerCase().replace(/\s+/g, '-'),
      label: form.label.trim(),
      labelAr: form.labelAr.trim(),
      icon: form.icon,
      count: 0,
      color: 'from-teal to-cyan-500',
    }])
    setForm({ label: '', labelAr: '', icon: ICONS[0] })
    showToast('Catégorie ajoutée')
  }

  const updateCategory = (id, field, value) => {
    setCategories(current => current.map(category => category.id === id ? { ...category, [field]: value } : category))
  }

  const deleteCategory = () => {
    setCategories(current => current.filter(category => category.id !== deleteTarget.id))
    setDeleteTarget(null)
    showToast('Catégorie supprimée')
  }

  return (
    <section className="space-y-4">
      <div className="glass rounded-2xl p-4">
        <h1 className="text-xl font-display font-bold text-white">Catégories</h1>
        <p className="mb-4 text-sm text-slate-400">Ajouter, modifier ou supprimer les services.</p>
        <form onSubmit={addCategory} className="grid gap-2 md:grid-cols-[1fr_1fr_120px_auto]">
          <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Nom FR" className="glass rounded-xl px-3 py-2 text-sm text-white outline-none" />
          <input value={form.labelAr} onChange={e => setForm(f => ({ ...f, labelAr: e.target.value }))} placeholder="Nom AR" className="glass rounded-xl px-3 py-2 text-sm text-white outline-none" />
          <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="glass rounded-xl px-3 py-2 text-sm text-white outline-none">
            {ICONS.map(icon => <option key={icon}>{icon}</option>)}
          </select>
          <button className="flex items-center justify-center gap-2 rounded-xl gradient-orange px-4 py-2 text-sm font-semibold text-white">
            <Plus size={15} /> Ajouter
          </button>
        </form>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.id} className="grid gap-2 rounded-xl bg-white/5 p-3 md:grid-cols-[56px_1fr_1fr_auto]">
              <div className="flex items-center justify-center text-xl">{category.icon}</div>
              <input value={category.label} onChange={e => updateCategory(category.id, 'label', e.target.value)} className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none" />
              <input value={category.labelAr} onChange={e => updateCategory(category.id, 'labelAr', e.target.value)} className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none" />
              <button onClick={() => setDeleteTarget(category)} className="flex items-center justify-center gap-2 rounded-lg bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-400">
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
          <div className="glass max-w-sm rounded-2xl p-5 text-center">
            <h2 className="mb-2 text-lg font-bold text-white">Supprimer cette catégorie ?</h2>
            <p className="mb-4 text-sm text-slate-400">{deleteTarget.label}</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl border border-white/10 py-2 text-sm text-slate-400">Annuler</button>
              <button onClick={deleteCategory} className="flex-1 rounded-xl bg-red-500/15 py-2 text-sm font-semibold text-red-400">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
