export default function CategoryCard({ cat, active, onClick, delay = 0 }) {
  return (
    <button
      onClick={() => onClick(cat.id)}
      className={`shrink-0 flex flex-col items-center gap-2 px-5 py-3 rounded-xl
        transition-all duration-300 border animate-fadeInUp anim-delay-${delay + 1}
        ${active
          ? 'border-teal/50 bg-teal/10 shadow-glow scale-105'
          : 'border-white/5 bg-white/4 hover:border-teal/20 hover:bg-white/8'
        }`}
    >
      <span className="text-2xl">{cat.icon}</span>
      <span className={`text-xs font-medium whitespace-nowrap ${active ? 'text-teal' : 'text-slate-300'}`}>
        {cat.label}
      </span>
      <span className="text-[10px] text-slate-500">{cat.count} dispo</span>
    </button>
  )
}
