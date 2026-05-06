import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Calendar, Home, LayoutDashboard, LogOut, Map, MessageCircle, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, role, logout, t, unreadMessages } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const clientLinks = [
    { to: '/', icon: Home, label: t.nav_home },
    { to: '/map', icon: Map, label: t.nav_map },
    { to: '/chat', icon: MessageCircle, label: t.nav_chat },
    { to: '/bookings', icon: Calendar, label: t.nav_bookings },
    { to: '/profile', icon: User, label: t.nav_profile },
  ]

  const artisanLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t.nav_dashboard },
    { to: '/map', icon: Map, label: t.nav_map },
    { to: '/chat', icon: MessageCircle, label: t.nav_chat },
    { to: '/bookings', icon: Calendar, label: t.nav_missions },
    { to: '/profile', icon: User, label: t.nav_profile },
  ]

  const links = role === 'prestataire' || role === 'artisan' ? artisanLinks : clientLinks
  const showBottomNav = user && !location.pathname.startsWith('/admin')

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-light-border dark:border-white/5">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-800 tracking-tight">
              <span className="text-teal">Khdima</span>
              <span className="text-light-text dark:text-white">Link</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <>
                <span className="text-xs text-light-muted capitalize bg-light-surface px-2 py-1 rounded-full hidden sm:block dark:bg-white/5 dark:text-slate-400">
                  {role}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 rounded-full hover:bg-light-surface transition-colors dark:hover:bg-white/10"
                >
                  <LogOut size={15} className="text-light-muted dark:text-slate-400" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-teal hover:text-light-text transition-colors dark:hover:text-white"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </header>

      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-light-border dark:border-white/5">
          <div className="max-w-lg mx-auto flex">
            {links.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to
              const showUnread = to === '/chat' && unreadMessages > 0
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all
                    ${active ? 'text-teal' : 'text-light-muted hover:text-light-text dark:text-slate-500 dark:hover:text-slate-300'}`}
                >
                  <span className="relative">
                    <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                    {showUnread && (
                      <span className="absolute -right-2 -top-2 min-w-4 h-4 px-1 rounded-full bg-brand-orange text-[9px] font-bold text-white flex items-center justify-center">
                        {unreadMessages}
                      </span>
                    )}
                  </span>
                  <span className="text-[9px] font-medium leading-tight text-center px-0.5">{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}
