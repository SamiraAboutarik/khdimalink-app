import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Home, MessageCircle, Calendar, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { user, role, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Bottom nav links depending on role
  const clientLinks = [
    { to: '/',         icon: Home,           label: 'Accueil' },
    { to: '/chat',     icon: MessageCircle,  label: 'Messages' },
    { to: '/bookings', icon: Calendar,       label: 'Réservations' },
    { to: '/profile',  icon: User,           label: 'Profil' },
  ]
  const artisanLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chat',      icon: MessageCircle,   label: 'Messages' },
    { to: '/bookings',  icon: Calendar,        label: 'Missions' },
    { to: '/profile',   icon: User,            label: 'Profil' },
  ]
  const links = role === 'artisan' ? artisanLinks : clientLinks

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-800 tracking-tight">
              <span className="text-teal">Khedma</span>
              <span className="text-white">Link</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-xs text-slate-400 capitalize bg-white/5 px-2.5 py-1 rounded-full">
                  {role}
                </span>
                <button onClick={handleLogout}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                  <LogOut size={16} className="text-slate-400" />
                </button>
              </>
            ) : (
              <Link to="/login"
                className="text-sm font-medium text-teal hover:text-white transition-colors">
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5">
          <div className="max-w-lg mx-auto flex">
            {links.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-all
                    ${active ? 'text-teal' : 'text-slate-500 hover:text-slate-300'}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}
