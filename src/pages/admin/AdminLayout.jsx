import { createContext, useContext, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { BarChart3, FolderKanban, LogOut, MessageSquare, ShieldCheck, Tags, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import AdminDashboard from './AdminDashboard'
import AdminUsers from './AdminUsers'
import AdminProviders from './AdminProviders'
import AdminCategories from './AdminCategories'
import AdminReviews from './AdminReviews'

const ToastContext = createContext(null)
export const useAdminToast = () => useContext(ToastContext)

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/admin/users', label: 'Utilisateurs', icon: Users },
  { to: '/admin/providers', label: 'Prestataires', icon: ShieldCheck },
  { to: '/admin/categories', label: 'Catégories', icon: Tags },
  { to: '/admin/reviews', label: 'Avis', icon: MessageSquare },
]

export default function AdminLayout() {
  const { logout } = useApp()
  const navigate = useNavigate()
  const [toast, setToast] = useState('')

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <ToastContext.Provider value={showToast}>
      <div className="gradient-bg min-h-screen pt-14">
        {toast && (
          <div className="fixed top-16 right-4 z-[80] rounded-xl border border-brand-green/30 bg-brand-green/15 px-4 py-3 text-sm font-semibold text-brand-green shadow-card">
            {toast}
          </div>
        )}

        <div className="mx-auto flex max-w-6xl gap-4 px-3 py-4">
          <aside className="glass sticky top-16 h-[calc(100vh-5rem)] w-16 shrink-0 rounded-2xl p-2 md:w-60">
            <div className="mb-4 hidden px-3 py-2 md:block">
              <p className="text-xs text-slate-400">Administration</p>
              <p className="font-display text-lg font-bold text-white">KhdimaLink</p>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all md:justify-start
                    ${isActive ? 'bg-teal/15 text-teal shadow-glow' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon size={18} />
                  <span className="hidden md:inline">{label}</span>
                </NavLink>
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10 md:justify-start"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </aside>

          <main className="min-w-0 flex-1">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="providers" element={<AdminProviders />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="reviews" element={<AdminReviews />} />
            </Routes>
          </main>
        </div>
      </div>
    </ToastContext.Provider>
  )
}
