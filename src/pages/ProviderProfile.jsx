import { useNavigate } from 'react-router-dom'
import { Briefcase, Camera, CheckCircle, Clock, LogOut, MapPin, Phone, Star, Tag, Wrench } from 'lucide-react'
import { useApp } from '../context/AppContext'
import artisans from '../data/artisans.json'
import StarRating from '../components/StarRating'

const PORTFOLIO = [
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=80',
]

const REVIEWS = [
  { id: 1, author: 'Fatima Z.', rating: 5, text: 'Intervention rapide et tres professionnelle.' },
  { id: 2, author: 'Karim B.', rating: 4, text: 'Bon travail, prix clair et ponctuel.' },
]

export default function ProviderProfile() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const provider = artisans[0]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="glass rounded-2xl p-5 mb-4 animate-fadeInUp">
          <div className="flex items-center gap-4">
            <img
              src={provider.avatar}
              alt={user?.name || provider.name}
              className="w-20 h-20 rounded-2xl bg-navy-700 object-cover shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-400">Profil prestataire</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-green/15 text-brand-green">
                  Disponible
                </span>
              </div>
              <h1 className="text-lg font-display font-bold text-white truncate">
                {user?.name || provider.name}
              </h1>
              <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                <Phone size={13} className="text-teal" /> {user?.phone || provider.phone}
              </p>
              <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin size={13} className="text-teal" /> {user?.city || provider.city}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 animate-fadeInUp anim-delay-1">
          {[
            { label: 'Categorie', value: provider.category, icon: Tag },
            { label: 'Tarif', value: provider.price, icon: Briefcase },
            { label: 'Disponibilite', value: provider.available ? 'Disponible' : 'Occupe', icon: Clock },
            { label: 'Avis recus', value: `${provider.reviews} avis`, icon: Star },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-2xl p-4">
              <Icon size={16} className="text-teal mb-2" />
              <p className="text-[10px] text-slate-400">{label}</p>
              <p className="text-sm font-semibold text-white capitalize">{value}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-2">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Wrench size={15} className="text-teal" /> Competences et specialites
          </h2>
          <div className="flex flex-wrap gap-2">
            {provider.skills.map(skill => (
              <span key={skill} className="text-xs bg-teal/10 text-teal border border-teal/20 px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-3">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Camera size={15} className="text-teal" /> Portfolio
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {PORTFOLIO.map(src => (
              <img key={src} src={src} alt="" className="aspect-square rounded-xl object-cover bg-navy-700" />
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 mb-5 animate-fadeInUp anim-delay-4">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle size={15} className="text-teal" /> Avis recus
          </h2>
          <div className="space-y-3">
            {REVIEWS.map(review => (
              <div key={review.id} className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-white">{review.author}</p>
                  <StarRating rating={review.rating} size={11} />
                </div>
                <p className="text-xs text-slate-400">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
            border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all
            font-medium text-sm animate-fadeInUp anim-delay-5"
        >
          <LogOut size={16} />
          Se deconnecter
        </button>
      </div>
    </div>
  )
}
