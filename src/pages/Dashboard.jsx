import { TrendingUp, Briefcase, Star, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import StarRating from '../components/StarRating'
import { useApp } from '../context/AppContext'

const PENDING_REQUESTS = [
  { id: 1, client: 'Fatima Z.', service: 'Fuite cuisine', time: 'Il y a 5 min',   urgent: true  },
  { id: 2, client: 'Karim B.', service: 'WC bouché',     time: 'Il y a 20 min',  urgent: false },
]

const RECENT_MISSIONS = [
  { id: 1, client: 'Sara M.', service: 'Installation robinet', date: 'Aujourd\'hui', amount: 180, rating: 5 },
  { id: 2, client: 'Omar H.', service: 'Fuite sous-évier',     date: 'Hier',         amount: 120, rating: 4 },
  { id: 3, client: 'Aicha L.', service: 'Chauffe-eau',         date: '05 Juin',      amount: 350, rating: 5 },
]

export default function Dashboard() {
  const { user } = useApp()

  const stats = [
    { label: 'Ce mois',    value: '4,850 MAD', sub: '+12%',  icon: TrendingUp,  color: 'text-brand-green',  bg: 'bg-brand-green/10' },
    { label: 'Missions',   value: '28',        sub: 'ce mois', icon: Briefcase, color: 'text-teal',          bg: 'bg-teal/10' },
    { label: 'Note moy.',  value: '4.8',       sub: '⭐',     icon: Star,       color: 'text-amber-400',     bg: 'bg-amber-400/10' },
    { label: 'En attente', value: '2',         sub: 'demandes', icon: Clock,    color: 'text-brand-orange',  bg: 'bg-brand-orange/10' },
  ]

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Greeting */}
        <div className="mb-5 animate-fadeInUp">
          <p className="text-slate-400 text-sm">Tableau de bord</p>
          <h1 className="text-xl font-display font-bold text-white">
            Bonjour {user?.name?.split(' ')[0] || 'Artisan'} 👷
          </h1>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {stats.map((s, i) => (
            <div key={s.label} className={`glass rounded-2xl p-4 animate-fadeInUp anim-delay-${i+1}`}>
              <div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mb-2.5`}>
                <s.icon size={15} className={s.color} />
              </div>
              <p className="text-xl font-display font-bold text-white">{s.value}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-slate-400">{s.label}</span>
                <span className={`text-[10px] font-medium ${s.color}`}>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pending requests */}
        <div className="mb-5 animate-fadeInUp anim-delay-3">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <AlertCircle size={15} className="text-brand-orange" />
            Demandes en attente
          </h2>
          <div className="space-y-3">
            {PENDING_REQUESTS.map((r, i) => (
              <div key={r.id} className={`glass rounded-xl p-4 flex items-center gap-3
                animate-fadeInUp anim-delay-${i+1}`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${r.urgent ? 'bg-brand-orange' : 'bg-brand-green'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{r.client}</p>
                  <p className="text-xs text-teal">{r.service}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{r.time}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button className="text-xs px-3 py-1.5 gradient-teal text-white rounded-lg font-medium shadow-glow
                    hover:opacity-90 transition-all">
                    Accepter
                  </button>
                  <button className="text-xs px-3 py-1.5 bg-white/5 text-slate-400 rounded-lg hover:bg-white/10 transition-all">
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent missions */}
        <div className="animate-fadeInUp anim-delay-4">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle size={15} className="text-brand-green" />
            Missions récentes
          </h2>
          <div className="space-y-3">
            {RECENT_MISSIONS.map((m, i) => (
              <div key={m.id} className={`glass rounded-xl p-4 flex items-center gap-3 animate-fadeInUp anim-delay-${i+1}`}>
                <div className="w-9 h-9 gradient-teal rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm">
                  {m.client[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{m.client}</p>
                  <p className="text-xs text-slate-400">{m.service}</p>
                  <StarRating rating={m.rating} size={11} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-orange">{m.amount} MAD</p>
                  <p className="text-[10px] text-slate-500">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
