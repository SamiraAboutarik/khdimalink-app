import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, MapPin, Briefcase, Star, CheckCircle, Clock, Calendar } from 'lucide-react'
import artisans from '../data/artisans.json'
import StarRating from '../components/StarRating'

const REVIEWS = [
  { author: 'Fatima Z.', date: 'Il y a 2 jours', text: 'Excellent travail, très professionnel et ponctuel !', rating: 5 },
  { author: 'Karim B.', date: 'Il y a 1 semaine', text: 'Travail soigné, je recommande vivement.', rating: 5 },
  { author: 'Sara M.', date: 'Il y a 2 semaines', text: 'Bon artisan, prix raisonnable.', rating: 4 },
]

export default function ArtisanProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const artisan = artisans.find(a => a.id === Number(id))

  if (!artisan) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <p className="text-slate-400">Artisan introuvable.</p>
    </div>
  )

  return (
    <div className="gradient-bg min-h-screen pb-24 pt-14">
      <div className="max-w-lg mx-auto">
        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-4 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Retour</span>
        </button>

        {/* Hero card */}
        <div className="mx-4 glass rounded-2xl p-5 mb-4 animate-fadeInUp">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img src={artisan.avatar} alt={artisan.name}
                className="w-20 h-20 rounded-2xl bg-navy-700 object-cover" />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-navy-900
                ${artisan.available ? 'bg-brand-green' : 'bg-slate-500'}`} />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-lg font-display font-bold text-white">{artisan.name}</h1>
              <p className="text-teal text-sm font-medium capitalize mb-1">{artisan.category}</p>
              <div className="flex items-center gap-2">
                <StarRating rating={artisan.rating} size={13} />
                <span className="text-amber-400 text-sm font-bold">{artisan.rating}</span>
                <span className="text-slate-500 text-xs">({artisan.reviews})</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin size={11} className="text-teal" /> {artisan.city} · {artisan.distance}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-slate-300 text-sm mt-4 leading-relaxed">{artisan.bio}</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Expérience',   value: artisan.experience,    icon: Briefcase },
              { label: 'Missions',     value: artisan.completedJobs, icon: CheckCircle },
              { label: 'Réponse',      value: artisan.responseTime,  icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/4 rounded-xl p-3 text-center">
                <Icon size={14} className="text-teal mx-auto mb-1" />
                <div className="text-sm font-bold text-white">{value}</div>
                <div className="text-[10px] text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mx-4 glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-1">
          <h2 className="text-sm font-semibold text-white mb-3">Compétences</h2>
          <div className="flex flex-wrap gap-2">
            {artisan.skills.map(skill => (
              <span key={skill}
                className="text-xs bg-teal/10 text-teal border border-teal/20 px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="mx-4 glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Tarif horaire estimé</p>
              <p className="text-xl font-display font-bold text-brand-orange">{artisan.price}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Contact</p>
              <p className="text-sm text-teal font-medium flex items-center gap-1">
                <Phone size={12} /> {artisan.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mx-4 mb-6 animate-fadeInUp anim-delay-3">
          <h2 className="text-sm font-semibold text-white mb-3">Avis clients</h2>
          <div className="space-y-3">
            {REVIEWS.map((r, i) => (
              <div key={i} className="glass rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full gradient-teal flex items-center justify-center text-white text-xs font-bold">
                      {r.author[0]}
                    </div>
                    <span className="text-sm font-medium text-white">{r.author}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{r.date}</span>
                </div>
                <StarRating rating={r.rating} size={11} />
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-white/5 max-w-lg mx-auto">
          <button
            onClick={() => navigate(`/booking/${artisan.id}`)}
            className="w-full gradient-orange py-4 rounded-xl font-bold text-white
              shadow-orange hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <Calendar size={18} />
            Réserver ce service
          </button>
        </div>
      </div>
    </div>
  )
}
