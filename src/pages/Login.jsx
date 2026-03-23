import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Hammer, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Login() {
  const [mode, setMode] = useState('login')        // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState('client')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')

  const { login } = useApp()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    // Simulate auth
    login({ name: form.name || 'Utilisateur', email: form.email }, selectedRole)
    navigate(selectedRole === 'artisan' ? '/dashboard' : '/')
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 animate-fadeInUp">
          <h1 className="text-3xl font-display font-extrabold">
            <span className="text-teal">Khedma</span><span className="text-white">Link</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">Services à domicile au Maroc 🇲🇦</p>
        </div>

        {/* Role selector */}
        <div className="flex glass rounded-xl p-1 mb-6 animate-fadeInUp anim-delay-1">
          {[
            { value: 'client',  label: 'Je suis client',   Icon: User   },
            { value: 'artisan', label: 'Je suis artisan',  Icon: Hammer },
          ].map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => setSelectedRole(value)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${selectedRole === value
                  ? 'gradient-teal text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Mode tabs */}
        <div className="flex gap-4 mb-6 animate-fadeInUp anim-delay-2">
          {[['login','Connexion'],['signup','Inscription']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`text-sm font-semibold pb-1 border-b-2 transition-all
                ${mode === m ? 'border-teal text-teal' : 'border-transparent text-slate-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 animate-fadeInUp anim-delay-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Nom complet"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500
                outline-none focus:border-teal/50 focus:shadow-glow transition-all"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500
              outline-none focus:border-teal/50 transition-all"
          />
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full glass rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500
                outline-none focus:border-teal/50 transition-all"
            />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit"
            className="w-full gradient-orange py-3.5 rounded-xl font-semibold text-white
              shadow-orange hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-95 mt-2">
            {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        {/* Demo hint */}
        <p className="text-center text-xs text-slate-600 mt-6 animate-fadeInUp anim-delay-4">
          💡 Demo : entrez n'importe quel email/mot de passe
        </p>
      </div>
    </div>
  )
}
