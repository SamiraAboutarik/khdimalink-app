import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Hammer, User, Phone, Lock, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAME_ERROR = 'Nom requis (min 3 caractères)'
const PHONE_ERROR = 'Numéro invalide. Ex: 0612345678'
const PASSWORD_ERROR = 'Min 8 caractères, 1 majuscule, 1 chiffre'

const normalizePhone = (phone) => phone.replace(/[\s.-]/g, '')
const isValidName = (name) => name.trim().length >= 3
const isValidMoroccanPhone = (phone) => {
  const clean = normalizePhone(phone)
  return /^0[567]\d{8}$/.test(clean) || /^\+212[67]\d{8}$/.test(clean)
}
const isValidPassword = (password) => (
  password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)
)

export default function Login() {
  const { login, t } = useApp()
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState('client')
  const [form, setForm] = useState({ name: '', phone: '', password: '' })
  const [touched, setTouched] = useState({ name: false, phone: false, password: false })
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const nameIsValid = isValidName(form.name)
  const phoneIsValid = isValidMoroccanPhone(form.phone)
  const passwordIsValid = isValidPassword(form.password)
  const formIsValid = nameIsValid && phoneIsValid && passwordIsValid
  const showNameError = (touched.name || submitted) && !nameIsValid
  const showPhoneError = (touched.phone || submitted) && !phoneIsValid
  const showPasswordError = (touched.password || submitted) && !passwordIsValid

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTouched({ name: true, phone: true, password: true })

    if (!formIsValid) {
      return
    }

    const phone = form.phone.trim()
    setLoading(true)

    window.setTimeout(() => {
      login({
        email: `${phone.replace(/\D/g, '') || 'user'}@mock.local`,
        name: form.name.trim(),
        phone,
      }, selectedRole)
      setLoading(false)
      setDone(true)

      window.setTimeout(() => {
        navigate(selectedRole === 'artisan' ? '/dashboard' : '/')
      }, 500)
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

        <div className="flex glass rounded-xl p-1 mb-5 animate-fadeInUp anim-delay-1">
          {[
            { value: 'client', label: t.iam_client, Icon: User },
            { value: 'artisan', label: t.iam_artisan, Icon: Hammer },
          ].map(({ value, label, Icon }) => (
            <button
              type="button"
              key={value}
              onClick={() => setSelectedRole(value)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${selectedRole === value
                  ? 'gradient-teal text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 animate-fadeInUp anim-delay-2">
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Nom complet"
              value={form.name}
              onChange={e => {
                setForm(f => ({ ...f, name: e.target.value }))
              }}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500
                outline-none focus:border-teal/50 transition-all"
            />
          </div>
          {showNameError && (
            <p className="text-red-400 text-xs px-1 -mt-1">{NAME_ERROR}</p>
          )}

          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              value={form.phone}
              onChange={e => {
                setForm(f => ({ ...f, phone: e.target.value }))
              }}
              onBlur={() => setTouched(t => ({ ...t, phone: true }))}
              className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500
                outline-none focus:border-teal/50 transition-all"
            />
          </div>
          {showPhoneError && (
            <p className="text-red-400 text-xs px-1 -mt-1">{PHONE_ERROR}</p>
          )}

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={form.password}
              onChange={e => {
                setForm(f => ({ ...f, password: e.target.value }))
              }}
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
          {showPasswordError && (
            <p className="text-red-400 text-xs px-1 -mt-1">{PASSWORD_ERROR}</p>
          )}

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

        <div className="glass rounded-xl p-3 mt-5 animate-fadeInUp anim-delay-3 border border-teal/15">
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Auth locale de demonstration. Aucun serveur n'est contacte.
          </p>
        </div>
      </div>
    </div>
  )
}
