import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import StarRating from '../components/StarRating'
import { useApp } from '../context/AppContext'
import artisans from '../data/artisans.json'

export default function Rating() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { bookings, reviews, addReview } = useApp()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const provider = artisans.find(item => String(item.id) === String(id))
  const eligibleBooking = bookings.find(booking => (
    String(booking.artisan_id || booking.artisanId) === String(id)
    && booking.status === 'completed'
    && !reviews.some(review => review.bookingId === booking.id)
  ))
  const canSubmit = eligibleBooking && rating > 0 && comment.trim().length >= 10

  const submit = () => {
    if (!canSubmit) return
    addReview({
      providerId: id,
      bookingId: eligibleBooking.id,
      rating,
      comment: comment.trim(),
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center max-w-sm w-full animate-fadeInUp">
          <div className="w-16 h-16 gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-display font-bold text-white mb-2">Merci pour votre avis !</h2>
          <p className="text-slate-400 text-sm mb-6">Votre evaluation aide la communaute KhdimaLink.</p>
          <button onClick={() => navigate(`/artisan/${id}`)}
            className="w-full gradient-orange py-3 rounded-xl font-semibold text-white shadow-orange">
            Voir le profil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="gradient-bg min-h-screen pb-24 pt-14">
      <div className="max-w-lg mx-auto px-4">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white py-4 transition-colors">
          <ArrowLeft size={18} /> <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-xl font-display font-bold text-white mb-1 animate-fadeInUp">Evaluation</h1>
        <p className="text-slate-400 text-sm mb-6 animate-fadeInUp anim-delay-1">
          {provider ? `Comment s'est passee l'intervention avec ${provider.name} ?` : 'Comment sest passee votre intervention ?'}
        </p>

        {!eligibleBooking && (
          <div className="glass rounded-2xl p-5 mb-4 text-center">
            <p className="text-sm font-semibold text-white mb-1">Avis indisponible</p>
            <p className="text-xs text-slate-400">Vous pouvez laisser un avis uniquement apres une reservation terminee.</p>
          </div>
        )}

        <div className="glass rounded-2xl p-6 text-center mb-4 animate-fadeInUp anim-delay-1">
          <p className="text-sm text-slate-400 mb-4">Votre note globale</p>
          <div className="flex justify-center mb-2">
            <StarRating rating={rating} size={40} interactive={Boolean(eligibleBooking)} onChange={setRating} />
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {rating === 0 ? 'Selectionnez une note' : rating <= 2 ? 'Pas satisfait' : rating === 3 ? 'Correct' : rating === 4 ? 'Bien' : 'Excellent'}
          </p>
        </div>

        <div className="glass rounded-2xl p-4 mb-6 animate-fadeInUp anim-delay-2">
          <p className="text-sm font-semibold text-white mb-3">Commentaire</p>
          <textarea rows={4} value={comment}
            onChange={event => setComment(event.target.value)}
            placeholder="Decrivez votre experience..."
            className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500
              outline-none border border-white/5 focus:border-teal/40 transition-all resize-none" />
          <p className={`text-xs mt-2 ${comment.trim().length >= 10 ? 'text-brand-green' : 'text-slate-500'}`}>
            Minimum 10 caracteres
          </p>
        </div>

        <button
          onClick={submit}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all
            ${canSubmit
              ? 'gradient-orange shadow-orange hover:opacity-90 hover:scale-[1.02]'
              : 'bg-slate-700 cursor-not-allowed text-slate-500'}`}>
          Soumettre l'evaluation
        </button>
      </div>
    </div>
  )
}
