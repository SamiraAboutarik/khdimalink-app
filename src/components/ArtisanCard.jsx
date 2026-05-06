import { Link } from 'react-router-dom'
import { Briefcase, Clock, Heart, MapPin } from 'lucide-react'
import StarRating from './StarRating'
import { useApp } from '../context/AppContext'

const CATEGORY_COLORS = {
  plombier: 'bg-blue-500/15 text-blue-400',
  electricien: 'bg-yellow-500/15 text-yellow-400',
  menuisier: 'bg-amber-500/15 text-amber-400',
  soudeur: 'bg-slate-500/15 text-slate-300',
  peintre: 'bg-pink-500/15 text-pink-400',
  carreleur: 'bg-orange-500/15 text-orange-400',
}

export default function ArtisanCard({ artisan, delay = 0 }) {
  const { favorites, toggleFavorite, reviews } = useApp()
  const catClass = CATEGORY_COLORS[artisan.category] || 'bg-teal/15 text-teal'
  const providerReviews = reviews.filter(review => String(review.providerId) === String(artisan.id))
  const averageRating = providerReviews.length
    ? providerReviews.reduce((sum, review) => sum + Number(review.rating), 0) / providerReviews.length
    : Number(artisan.rating || 0)
  const reviewCount = providerReviews.length || artisan.review_count || artisan.reviews || 0
  const isFavorite = favorites.includes(String(artisan.id))
  const avatarUrl = artisan.avatar_url || artisan.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${artisan.name}`
  const priceLabel = artisan.price_label || artisan.price || 'Sur devis'
  const priceMin = priceLabel.split('-')[0]
  const experience = artisan.experience_label || artisan.experience || '-'
  const responseTime = artisan.response_time || artisan.responseTime || '-'
  const distance = artisan.distance_label || artisan.distance || ''

  return (
    <Link
      to={`/artisan/${artisan.id}`}
      className={`block glass rounded-2xl p-4 hover:border-teal/30 hover:shadow-glow
        transition-all duration-300 group animate-fadeInUp anim-delay-${delay + 1}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative shrink-0">
          <img
            src={avatarUrl}
            alt={artisan.name}
            className="w-14 h-14 rounded-xl object-cover bg-slate-800"
          />
          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#060B18]
            ${artisan.available ? 'bg-green-400' : 'bg-slate-500'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-white truncate group-hover:text-teal transition-colors">
            {artisan.name}
          </h3>
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 capitalize ${catClass}`}>
            {artisan.category}
          </span>
        </div>

        <div className="flex items-start gap-2 shrink-0">
          <button
            type="button"
            onClick={event => {
              event.preventDefault()
              toggleFavorite(artisan.id)
            }}
            className={`p-2 rounded-xl transition-all ${isFavorite ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-slate-400 hover:text-red-400'}`}
            aria-label="Favori"
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <div className="text-right">
            <div className="text-xs text-slate-400">A partir de</div>
            <div className="text-sm font-semibold text-brand-orange">{priceMin}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <StarRating rating={averageRating} size={13} />
        <span className="text-sm font-semibold text-amber-400">{averageRating ? averageRating.toFixed(1) : '-'}</span>
        <span className="text-xs text-slate-500">({reviewCount} avis)</span>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        {distance && (
          <span className="flex items-center gap-1">
            <MapPin size={11} className="text-teal" /> {distance}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Briefcase size={11} className="text-teal" /> {experience}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={11} className="text-green-400" />
          <span className="text-green-400">{responseTime}</span>
        </span>
      </div>
    </Link>
  )
}
