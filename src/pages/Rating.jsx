import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import StarRating from '../components/StarRating'

const QUICK_TAGS = ['Ponctuel','Propre','Professionnel','Rapide','Prix correct','À recommander']

export default function Rating() {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [tags, setTags] = useState([])
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const toggleTag = (t) => setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  if (submitted) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 text-center max-w-sm w-full animate-fadeInUp">
        <div className="w-16 h-16 gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-2">Merci pour votre avis !</h2>
        <p className="text-slate-400 text-sm mb-6">Votre évaluation aide la communauté KhedmaLink 🌟</p>
        <button onClick={() => navigate('/')}
          className="w-full gradient-orange py-3 rounded-xl font-semibold text-white shadow-orange">
          Retour à l'accueil
        </button>
      </div>
    </div>
  )

  return (
    <div className="gradient-bg min-h-screen pb-24 pt-14">
      <div className="max-w-lg mx-auto px-4">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white py-4 transition-colors">
          <ArrowLeft size={18} /> <span className="text-sm">Retour</span>
        </button>

        <h1 className="text-xl font-display font-bold text-white mb-1 animate-fadeInUp">Évaluation</h1>
        <p className="text-slate-400 text-sm mb-6 animate-fadeInUp anim-delay-1">Comment s'est passée votre intervention ?</p>

        {/* Stars */}
        <div className="glass rounded-2xl p-6 text-center mb-4 animate-fadeInUp anim-delay-1">
          <p className="text-sm text-slate-400 mb-4">Votre note globale</p>
          <div className="flex justify-center mb-2">
            <StarRating rating={rating} size={40} interactive onChange={setRating} />
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {rating === 0 ? 'Sélectionnez une note' :
             rating <= 2 ? '😕 Pas satisfait' :
             rating === 3 ? '😐 Correct' :
             rating === 4 ? '🙂 Bien' : '🤩 Excellent !'}
          </p>
        </div>

        {/* Quick tags */}
        <div className="glass rounded-2xl p-4 mb-4 animate-fadeInUp anim-delay-2">
          <p className="text-sm font-semibold text-white mb-3">Points positifs</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TAGS.map(t => (
              <button key={t} onClick={() => toggleTag(t)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border
                  ${tags.includes(t)
                    ? 'bg-teal/20 text-teal border-teal/40'
                    : 'bg-white/4 text-slate-400 border-white/5 hover:border-teal/20'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="glass rounded-2xl p-4 mb-6 animate-fadeInUp anim-delay-3">
          <p className="text-sm font-semibold text-white mb-3">Commentaire (optionnel)</p>
          <textarea rows={4} value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Décrivez votre expérience..."
            className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500
              outline-none border border-white/5 focus:border-teal/40 transition-all resize-none" />
        </div>

        <button
          onClick={() => rating > 0 && setSubmitted(true)}
          disabled={rating === 0}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all
            ${rating > 0
              ? 'gradient-orange shadow-orange hover:opacity-90 hover:scale-[1.02]'
              : 'bg-slate-700 cursor-not-allowed text-slate-500'}`}>
          Soumettre l'évaluation
        </button>
      </div>
    </div>
  )
}
