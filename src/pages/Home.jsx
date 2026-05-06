import { useEffect, useState } from 'react'
import { Search, Bell, Zap, MapPin } from 'lucide-react'
import ArtisanCard from '../components/ArtisanCard'
import CategoryCard from '../components/CategoryCard'
import { useApp } from '../context/AppContext'
import categories from '../data/categories.json'
import artisansData from '../data/artisans.json'

export default function Home() {
  const { user } = useApp()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [urgencyMode, setUrgencyMode] = useState(false)
  const [artisans, setArtisans] = useState(artisansData)

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const nextArtisans = artisansData
      .filter(artisan => !activeCategory || artisan.category === activeCategory)
      .filter(artisan => !urgencyMode || artisan.available)
      .filter(artisan => {
        if (!normalizedQuery) return true
        return [artisan.name, artisan.category, artisan.bio]
          .filter(Boolean)
          .some(value => value.toLowerCase().includes(normalizedQuery))
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))

    setArtisans(nextArtisans)
  }, [activeCategory, urgencyMode, query])

  const handleCategory = (id) => {
    setActiveCategory(prev => prev === id ? null : id)
  }

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="px-4 pt-5 pb-4 max-w-lg mx-auto">
        <div className="flex items-start justify-between mb-4 animate-fadeInUp">
          <div>
            <p className="text-slate-400 text-sm">Bonjour {user?.name?.split(' ')[0] || 'la'}</p>
            <h1 className="text-xl font-display font-bold text-white leading-tight">
              Trouvez votre prestataire<br/>
              <span className="text-teal">a Agadir</span>
            </h1>
          </div>
          <button className="relative p-2.5 glass rounded-xl">
            <Bell size={18} className="text-slate-300" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 animate-fadeInUp anim-delay-1">
          <MapPin size={12} className="text-teal" />
          <span>
            Agadir, Souss-Massa -{' '}
            <span className="text-brand-green">
              {artisans.length} prestataires disponibles
            </span>
          </span>
        </div>

        <div className="relative mb-5 animate-fadeInUp anim-delay-2">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Chercher un prestataire..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500
              outline-none focus:border-teal/40 focus:shadow-glow transition-all"
          />
        </div>

        <button
          onClick={() => setUrgencyMode(v => !v)}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold
            text-sm transition-all duration-300 mb-5 animate-fadeInUp anim-delay-3
            ${urgencyMode
              ? 'gradient-orange text-white shadow-orange animate-pulse'
              : 'border border-brand-orange/40 text-brand-orange hover:bg-brand-orange/10'}`}>
          <Zap size={16} fill={urgencyMode ? 'currentColor' : 'none'} />
          {urgencyMode ? 'Mode urgence active - artisans disponibles' : 'Besoin d\'un prestataire maintenant'}
        </button>

        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-3 animate-fadeInUp anim-delay-3">Categories</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                active={activeCategory === cat.id}
                onClick={handleCategory}
                delay={i}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300 animate-fadeInUp anim-delay-4">
              {activeCategory
                ? `${categories.find(c => c.id === activeCategory)?.label}s`
                : 'Prestataires pres de vous'}
            </h2>
            <span className="text-xs text-slate-500">{artisans.length} trouves</span>
          </div>

          {artisans.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center animate-fadeInUp">
              <p className="text-4xl mb-2">?</p>
              <p className="text-slate-400 text-sm">Aucun prestataire trouve</p>
              {(query || activeCategory) && (
                <button
                  onClick={() => { setQuery(''); setActiveCategory(null) }}
                  className="mt-3 text-xs text-teal underline"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {artisans.map((a, i) => (
                <ArtisanCard key={a.id} artisan={a} delay={i % 4} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
