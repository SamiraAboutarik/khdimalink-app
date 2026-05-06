import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, MapPin, Briefcase, Star, CheckCircle, Clock, Calendar, MessageCircle, CreditCard, Loader } from 'lucide-react'
import StarRating from '../components/StarRating'
import { useApp } from '../context/AppContext'
import artisansData from '../data/artisans.json'

const MOCK_REVIEWS = [
  {
    id: 1,
    author_name: 'Fatima Z.',
    rating: 5,
    comment: 'Service rapide et travail propre.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    author_name: 'Karim B.',
    rating: 4,
    comment: 'Bon contact et prix clair.',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
]

export default function ArtisanProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useApp()

  const [artisan, setArtisan]   = useState(null)
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(true)

  // ─── CHARGER L'ARTISAN + SES AVIS ─────────────────────────────
  useEffect(() => {
    setLoading(true)
    setArtisan(artisansData.find(item => String(item.id) === String(id)) || null)
    setReviews(MOCK_REVIEWS)
    setLoading(false)
  }, [id])

  // ─── ÉTAT CHARGEMENT ──────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center">
        <Loader size={28} className="text-teal mx-auto mb-3 animate-spin" />
        <p className="text-slate-400 text-sm">Chargement du profil...</p>
      </div>
    </div>
  )

  // ─── ARTISAN INTROUVABLE ───────────────────────────────────────
  if (!artisan) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 text-center max-w-sm w-full">
        <p className="text-4xl mb-3">😕</p>
        <p className="text-white font-semibold mb-2">Artisan introuvable</p>
        <button onClick={() => navigate('/')} className="text-teal text-sm underline">
          Retour à l'accueil
        </button>
      </div>
    </div>
  )

  // ─── Helpers pour affichage ───────────────────────────────────
  const avatarUrl = artisan.avatar_url || artisan.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artisan.name}`
  const priceLabel = artisan.price_label || artisan.price || (artisan.price_min ? `${artisan.price_min}-${artisan.price_max} MAD/h` : 'Sur devis')
  const expLabel = artisan.experience_label || (artisan.experience_years ? `${artisan.experience_years} ans` : 'N/A')

  // Formater la date d'un avis
  const formatDate = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000)
    if (diff === 0) return 'Aujourd\'hui'
    if (diff === 1) return 'Hier'
    if (diff < 7)  return `Il y a ${diff} jours`
    if (diff < 30) return `Il y a ${Math.floor(diff/7)} semaine${diff >= 14 ? 's' : ''}`
    return `Il y a ${Math.floor(diff/30)} mois`
  }

  return (
    <div className="gradient-bg min-h-screen pb-28 pt-14">
      <div className="max-w-lg mx-auto">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-4 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Retour</span>
        </button>

        {/* Hero card */}
        <div className="mx-4 glass rounded-2xl p-5 mb-4 animate-fadeInUp">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={avatarUrl}
                alt={artisan.name}
                className="w-20 h-20 rounded-2xl bg-slate-800 object-cover"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#060B18]
                ${artisan.available ? 'bg-green-400' : 'bg-slate-500'}`} />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-display font-bold text-white">{artisan.name}</h1>
              <p className="text-teal text-sm font-medium capitalize mb-1">{artisan.category}</p>
              <div className="flex items-center gap-2">
                <StarRating rating={artisan.rating || 0} size={13} />
                <span className="text-amber-400 text-sm font-bold">{artisan.rating || '—'}</span>
                <span className="text-slate-500 text-xs">({artisan.review_count || 0})</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin size={11} className="text-teal" /> {artisan.city}
                {artisan.distance_label && ` · ${artisan.distance_label}`}
              </p>
            </div>
          </div>

          {artisan.bio && (
            <p className="text-slate-300 text-sm mt-4 leading-relaxed">{artisan.bio}</p>
          )}

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Expérience',  value: expLabel,                   icon: Briefcase },
              { label: 'Missions',    value: artisan.completed_jobs || 0, icon: CheckCircle },
              { label: 'Réponse',     value: artisan.response_time || 'N/A', icon: Clock },
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
        {artisan.skills?.length > 0 && (
          <div className="mx-4 glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-1">
            <h2 className="text-sm font-semibold text-white mb-3">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {artisan.skills.map(skill => (
                <span key={skill} className="text-xs bg-teal/10 text-teal border border-teal/20 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price + Phone */}
        <div className="mx-4 glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Tarif estimé</p>
              <p className="text-xl font-display font-bold text-brand-orange">{priceLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Contact</p>
              <a href={`tel:${artisan.phone}`}
                className="text-sm text-teal font-medium flex items-center gap-1 justify-end">
                <Phone size={12} /> {artisan.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Paiement */}
        <div className="mx-4 glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-2 border border-teal/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-teal" />
              <span className="text-sm font-semibold text-white">Paiement sécurisé</span>
            </div>
            <button
              onClick={() => navigate('/payment')}
              className="text-xs text-teal bg-teal/10 px-3 py-1.5 rounded-full hover:bg-teal/20 transition-all">
              Voir les options →
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {['💵 Cash', '💳 CMI', '📱 CIH Mobile', '🏦 Wafacash'].map(m => (
              <span key={m} className="text-[10px] text-slate-400 bg-white/5 px-2 py-1 rounded-full">{m}</span>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mx-4 mb-6 animate-fadeInUp anim-delay-3">
          <h2 className="text-sm font-semibold text-white mb-3">
            Avis clients {reviews.length > 0 && `(${reviews.length})`}
          </h2>

          {reviews.length === 0 ? (
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-slate-500 text-xs">Pas encore d'avis — soyez le premier !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="glass rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full gradient-teal flex items-center justify-center text-white text-xs font-bold">
                        {(r.author_name || 'A')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white">{r.author_name || 'Anonyme'}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{formatDate(r.created_at)}</span>
                  </div>
                  <StarRating rating={r.rating} size={11} />
                  {r.comment && (
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Double CTA fixe */}
        <div className="fixed bottom-20 left-0 right-0 p-4 glass border-t border-white/5 max-w-lg mx-auto">
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="flex-1 flex items-center justify-center gap-2
                border border-teal/50 text-teal bg-teal/8 hover:bg-teal/15
                py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95">
              <MessageCircle size={18} />
              {t.discuss}
            </button>
            <button
              onClick={() => navigate(`/booking/${artisan.id}`)}
              className="flex-[1.6] gradient-orange py-3.5 rounded-xl font-bold text-white
                shadow-orange hover:opacity-90 transition-all flex items-center justify-center gap-2
                hover:scale-[1.02] active:scale-95">
              <Calendar size={18} />
              {t.book}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
