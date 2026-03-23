import { useNavigate } from 'react-router-dom'
import { LogOut, Settings, Bell, Shield, HelpCircle, ChevronRight, Star, Briefcase } from 'lucide-react'
import { useApp } from '../context/AppContext'

const MENU_ITEMS = [
  { icon: Bell,       label: 'Notifications',    sub: 'Gérer les alertes' },
  { icon: Shield,     label: 'Sécurité',          sub: 'Mot de passe & confidentialité' },
  { icon: Settings,   label: 'Paramètres',        sub: 'Langue, région' },
  { icon: HelpCircle, label: 'Aide & Support',    sub: 'FAQ, nous contacter' },
]

export default function Profile() {
  const { user, role, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Profile card */}
        <div className="glass rounded-2xl p-5 mb-4 animate-fadeInUp">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 gradient-teal rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-white">{user?.name || 'Utilisateur'}</h1>
              <p className="text-sm text-slate-400">{user?.email || 'email@example.com'}</p>
              <span className="inline-block text-xs font-medium bg-teal/15 text-teal px-2.5 py-0.5 rounded-full mt-1 capitalize">
                {role || 'client'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
            {[
              { label: 'Réservations', value: '5',   icon: Briefcase },
              { label: 'Avis donnés',  value: '3',   icon: Star      },
              { label: 'Artisans fav', value: '7',   icon: '❤️'      },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-[10px] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="glass rounded-2xl px-4 py-3.5 mb-4 flex items-center justify-between animate-fadeInUp anim-delay-1">
          <div>
            <p className="text-xs text-slate-400">Ma localisation</p>
            <p className="text-sm font-medium text-white">Agadir, Souss-Massa 🇲🇦</p>
          </div>
          <span className="text-xs text-teal bg-teal/10 px-2.5 py-1 rounded-full">Modifier</span>
        </div>

        {/* Menu */}
        <div className="glass rounded-2xl overflow-hidden mb-4 animate-fadeInUp anim-delay-2">
          {MENU_ITEMS.map((item, i) => (
            <button key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors
                ${i < MENU_ITEMS.length - 1 ? 'border-b border-white/5' : ''}`}>
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                <item.icon size={15} className="text-teal" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-slate-500">{item.sub}</p>
              </div>
              <ChevronRight size={15} className="text-slate-600" />
            </button>
          ))}
        </div>

        {/* App version */}
        <p className="text-center text-xs text-slate-600 mb-4 animate-fadeInUp anim-delay-3">
          KhedmaLink v1.0.0 · Agadir, Maroc 🇲🇦
        </p>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
            border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all
            font-medium text-sm animate-fadeInUp anim-delay-4">
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
