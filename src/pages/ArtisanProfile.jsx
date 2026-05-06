import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Briefcase, Calendar, CheckCircle, Clock, Heart, Loader, MapPin, MessageCircle, Phone } from 'lucide-react'
import StarRating from '../components/StarRating'
import { useApp } from '../context/AppContext'
import artisansData from '../data/artisans.json'

export default function ArtisanProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, favorites, toggleFavorite, reviews } = useApp()
  const [artisan, setArtisan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setArtisan(artisansData.find(item => String(item.id) === String(id)) || null)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <Loader size={28} className="text-teal animate-spin" />
      </div>
    )
  }

  if (!artisan) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center max-w-sm w-full">
          <p className="text-white font-semibold mb-2">Artisan introuvable</p>
          <button onClick={() => navigate('/')} className="text-teal text-sm underline">
            Retour a l'accueil
          </button>
        </div>
      </div>
    )
  }

  const providerReviews = reviews.filter(review => String(review.providerId) === String(artisan.id))
  const averageRating = providerReviews.length
    ? providerReviews.reduce((sum, review) => sum + Number(review.rating), 0) / providerReviews.length
    : Number(artisan.rating || 0)
  const reviewCount = providerReviews.length || artisan.review_count || 0
  const isFavorite = favorites.includes(String(artisan.id))
  const avatarUrl = artisan.avatar_url || artisan.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artisan.name}`
  const priceLabel = artisan.price_label || artisan.price || (artisan.price_min ? `${artisan.price_min}-${artisan.price_max} MAD/h` : 'Sur devis')
  const expLabel = artisan.experience_label || (artisan.experience_years ? `${artisan.experience_years} ans` : 'N/A')

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="gradient-bg min-h-screen pb-28 pt-14">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-4 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Retour</span>
        </button>

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
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="text-lg font-display font-bold text-white truncate">{artisan.name}</h1>
                  <p className="text-teal text-sm font-medium capitalize mb-1">{artisan.category}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(artisan.id)}
                  className={`p-2 rounded-xl transition-all ${isFavorite ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-slate-400 hover:text-red-400'}`}
                  aria-label="Favori"
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} size={13} />
                <span className="text-amber-400 text-sm font-bold">{averageRating ? averageRating.toFixed(1) : '-'}</span>
                <span className="text-slate-500 text-xs">({reviewCount})</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin size={11} className="text-teal" /> {artisan.city}
                {artisan.distance_label && ` - ${artisan.distance_label}`}
              </p>
            </div>
          </div>

          {artisan.bio && (
            <p className="text-slate-300 text-sm mt-4 leading-relaxed">{artisan.bio}</p>
          )}

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Experience', value: expLabel, icon: Briefcase },
              { label: 'Missions', value: artisan.completed_jobs || 0, icon: CheckCircle },
              { label: 'Reponse', value: artisan.response_time || 'N/A', icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/4 rounded-xl p-3 text-center">
                <Icon size={14} className="text-teal mx-auto mb-1" />
                <div className="text-sm font-bold text-white">{value}</div>
                <div className="text-[10px] text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {artisan.skills?.length > 0 && (
          <div className="mx-4 glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-1">
            <h2 className="text-sm font-semibold text-white mb-3">Competences</h2>
            <div className="flex flex-wrap gap-2">
              {artisan.skills.map(skill => (
                <span key={skill} className="text-xs bg-teal/10 text-teal border border-teal/20 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mx-4 glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Tarif estime</p>
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

        <div className="mx-4 mb-6 animate-fadeInUp anim-delay-3">
          <h2 className="text-sm font-semibold text-white mb-3">
            Avis clients {providerReviews.length > 0 && `(${providerReviews.length})`}
          </h2>

          {providerReviews.length === 0 ? (
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-slate-500 text-xs">Pas encore d'avis.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {providerReviews.map(review => (
                <div key={review.id} className="glass rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full gradient-teal flex items-center justify-center text-white text-xs font-bold">
                        {(review.clientName || 'C')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white">{review.clientName || 'Client'}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{formatDate(review.date)}</span>
                  </div>
                  <StarRating rating={review.rating} size={11} />
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

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
