import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Phone, Lock, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getMockUserByCredentials } from '../lib/mockAuth'

const PHONE_ERROR = 'Numéro invalide. Ex: 0612345678'
const PASSWORD_ERROR = 'Min 8 caractères, 1 majuscule, 1 chiffre'

const normalizePhone = (phone) => phone.replace(/[\s.-]/g, '')
const isValidMoroccanPhone = (phone) => {
  const clean = normalizePhone(phone)
  return /^0[567]\d{8}$/.test(clean) || /^\+212[67]\d{8}$/.test(clean)
}
const isValidPassword = (password) => (
  password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)
)

const roleHomePath = (role) => {
  if (role === 'admin') return '/admin'
  if (role === 'prestataire') return '/dashboard'
  return '/'
}

export default function Login() {
  const { login, t } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ phone: '', password: '' })
  const [touched, setTouched] = useState({ phone: false, password: false })
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const phoneIsValid = isValidMoroccanPhone(form.phone)
  const passwordIsValid = isValidPassword(form.password)
  const formIsValid = phoneIsValid && passwordIsValid
  const showPhoneError = (touched.phone || submitted) && !phoneIsValid
  const showPasswordError = (touched.password || submitted) && !passwordIsValid
  const successMessage = location.state?.success

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTouched({ phone: true, password: true })

    if (!formIsValid) return

    const phone = form.phone.trim()
    setLoading(true)

    window.setTimeout(() => {
      const mockUser = getMockUserByCredentials(phone, form.password)

      if (mockUser) {
        const user = login({
          email: mockUser.email,
          name: mockUser.nom,
          phone: mockUser.phone,
          role: mockUser.role,
        }, mockUser.role)
        setLoading(false)
        setDone(true)
        navigate(roleHomePath(user.role), { replace: true })
        return
      }

      const user = login({
        email: `${phone.replace(/\D/g, '') || 'user'}@mock.local`,
        name: phone,
        phone,
        role: 'client',
      }, 'client')
      setLoading(false)
      setDone(true)
      navigate(roleHomePath(user.role), { replace: true })
    }, 250)
  }

  if (done) return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="text-center animate-fadeInUp">
        <div className="w-20 h-20 gradient-teal rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Connecte !</h2>
        <p className="text-slate-400 text-sm">Redirection en cours...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-7 animate-fadeInUp">
          <h1 className="text-3xl font-display font-extrabold">
            <span className="text-teal">Khdima</span><span className="text-white">Link</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">{t.appTagline}</p>
        </div>

        {successMessage && (
          <div className="glass rounded-xl p-3 mb-4 border border-brand-green/30 animate-fadeInUp">
            <p className="text-xs text-brand-green text-center font-semibold">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 animate-fadeInUp anim-delay-1">
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, phone: true }))}
              className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500
                outline-none focus:border-teal/50 transition-all"
            />
          </div>
          {showPhoneError && <p className="text-red-400 text-xs px-1 -mt-1">{PHONE_ERROR}</p>}

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              className="w-full glass rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500
                outline-none focus:border-teal/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {showPasswordError && <p className="text-red-400 text-xs px-1 -mt-1">{PASSWORD_ERROR}</p>}

          <button
            type="submit"
            disabled={loading || !formIsValid}
            className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200
              flex items-center justify-center gap-2 mt-1
              ${loading || !formIsValid
                ? 'bg-slate-700 cursor-not-allowed'
                : 'gradient-orange shadow-orange hover:opacity-90 hover:scale-[1.02] active:scale-95'}`}
          >
            {loading
              ? <><Loader size={17} className="animate-spin" /> Connexion...</>
              : <><Phone size={17} /> Se connecter</>
            }
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5 animate-fadeInUp anim-delay-2">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-teal font-semibold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
