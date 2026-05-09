import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, CheckCircle, Eye, EyeOff, Hammer, Image, Lock, MapPin, Phone, User } from 'lucide-react'
import { MOCK_ADMIN_USER, MOCK_PROVIDER_USER, REGISTERED_USERS_KEY, getRegisteredUsers, normalizePhone } from '../lib/mockAuth'

const CITIES = ['Agadir', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Oujda', 'Autre']
const SERVICE_CATEGORIES = ['Plomberie', 'Électricité', 'Menuiserie', 'Peinture', 'Nettoyage', 'Jardinage', 'Autre']

const ERRORS = {
  name: 'Nom requis (min 3 caractères)',
  phone: 'Numéro invalide. Ex: 0612345678',
  city: 'Ville requise',
  password: 'Min 8 caractères, 1 majuscule, 1 chiffre',
  confirmPassword: 'Les mots de passe ne correspondent pas',
  terms: "Vous devez accepter les conditions d'utilisation",
  serviceCategory: 'Catégorie de service requise',
  description: 'Description requise (20 à 200 caractères)',
  rate: 'Tarif requis',
  photo: 'Image requise (max 2MB)',
}

const initialForm = {
  name: '',
  phone: '',
  city: '',
  password: '',
  confirmPassword: '',
  terms: false,
  serviceCategory: '',
  description: '',
  rate: '',
  photo: null,
}

const isValidPhone = (phone) => /^0[567]\d{8}$/.test(normalizePhone(phone))
const isValidPassword = (password) => password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)
const isValidPhoto = (file) => file && file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024

function getFieldError(field, form, role) {
  switch (field) {
    case 'name':
      return form.name.trim().length >= 3 ? '' : ERRORS.name
    case 'phone':
      return isValidPhone(form.phone) ? '' : ERRORS.phone
    case 'city':
      return form.city ? '' : ERRORS.city
    case 'password':
      return isValidPassword(form.password) ? '' : ERRORS.password
    case 'confirmPassword':
      return form.confirmPassword && form.confirmPassword === form.password ? '' : ERRORS.confirmPassword
    case 'terms':
      return form.terms ? '' : ERRORS.terms
    case 'serviceCategory':
      return role === 'client' || form.serviceCategory ? '' : ERRORS.serviceCategory
    case 'description':
      return role === 'client' || (form.description.trim().length >= 20 && form.description.trim().length <= 200) ? '' : ERRORS.description
    case 'rate':
      return role === 'client' || Number(form.rate) > 0 ? '' : ERRORS.rate
    case 'photo':
      return role === 'client' || isValidPhoto(form.photo) ? '' : ERRORS.photo
    default:
      return ''
  }
}

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState('client')
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phoneSubmitError, setPhoneSubmitError] = useState('')

  const fields = role === 'client'
    ? ['name', 'phone', 'city', 'password', 'confirmPassword', 'terms']
    : ['name', 'phone', 'city', 'password', 'confirmPassword', 'terms', 'serviceCategory', 'description', 'rate', 'photo']

  const errors = Object.fromEntries(fields.map(field => [field, getFieldError(field, form, role)]))
  const formIsValid = fields.every(field => !errors[field])

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }))
  }

  const markTouched = (field) => {
    setTouched(current => ({ ...current, [field]: true }))
  }

  const shouldShowError = (field) => (touched[field] || submitted) && errors[field]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setPhoneSubmitError('')
    setTouched(Object.fromEntries(fields.map(field => [field, true])))

    if (!formIsValid) return

    const cleanPhone = normalizePhone(form.phone)
    const existingUsers = getRegisteredUsers()
    const phoneExists = [MOCK_ADMIN_USER, MOCK_PROVIDER_USER, ...existingUsers]
      .some(user => normalizePhone(user.phone) === cleanPhone)

    if (phoneExists) {
      setPhoneSubmitError('Ce numéro est déjà utilisé.')
      return
    }

    const newUser = {
      id: Date.now(),
      nom: form.name.trim(),
      phone: cleanPhone,
      password: form.password,
      role,
      ville: form.city,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...existingUsers, newUser]))

    navigate('/login', {
      state: { success: 'Compte créé ! Connectez-vous.' },
      replace: true,
    })
  }

  const inputClass = 'w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-teal/50 transition-all'
  const iconInputClass = 'w-full glass rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-teal/50 transition-all'

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-7 animate-fadeInUp">
          <h1 className="text-3xl font-display font-extrabold">
            <span className="text-teal">Khdima</span><span className="text-white">Link</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">Créer un compte</p>
        </div>

        <div className="flex glass rounded-xl p-1 mb-5 animate-fadeInUp anim-delay-1">
          {[
            { value: 'client', label: 'Je suis client', Icon: User },
            { value: 'prestataire', label: 'Je suis prestataire', Icon: Hammer },
          ].map(({ value, label, Icon }) => (
            <button
              type="button"
              key={value}
              onClick={() => {
                setRole(value)
                setSubmitted(false)
                setTouched({})
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${role === value
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
              onChange={e => updateField('name', e.target.value)}
              onBlur={() => markTouched('name')}
              className={iconInputClass}
            />
          </div>
          {shouldShowError('name') && <p className="text-red-400 text-xs px-1 -mt-1">{errors.name}</p>}

          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              placeholder="Téléphone marocain"
              value={form.phone}
              onChange={e => {
                updateField('phone', e.target.value)
                setPhoneSubmitError('')
              }}
              onBlur={() => markTouched('phone')}
              className={iconInputClass}
            />
          </div>
          {shouldShowError('phone') && <p className="text-red-400 text-xs px-1 -mt-1">{errors.phone}</p>}
          {!shouldShowError('phone') && phoneSubmitError && <p className="text-red-400 text-xs px-1 -mt-1">{phoneSubmitError}</p>}

          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={form.city}
              onChange={e => updateField('city', e.target.value)}
              onBlur={() => markTouched('city')}
              className={iconInputClass}
            >
              <option value="">Ville</option>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          {shouldShowError('city') && <p className="text-red-400 text-xs px-1 -mt-1">{errors.city}</p>}

          <PasswordField
            value={form.password}
            placeholder="Mot de passe"
            show={showPassword}
            onToggle={() => setShowPassword(v => !v)}
            onChange={value => updateField('password', value)}
            onBlur={() => markTouched('password')}
          />
          {shouldShowError('password') && <p className="text-red-400 text-xs px-1 -mt-1">{errors.password}</p>}

          <PasswordField
            value={form.confirmPassword}
            placeholder="Confirmer mot de passe"
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(v => !v)}
            onChange={value => updateField('confirmPassword', value)}
            onBlur={() => markTouched('confirmPassword')}
          />
          {shouldShowError('confirmPassword') && <p className="text-red-400 text-xs px-1 -mt-1">{errors.confirmPassword}</p>}

          {role === 'prestataire' && (
            <>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={form.serviceCategory}
                  onChange={e => updateField('serviceCategory', e.target.value)}
                  onBlur={() => markTouched('serviceCategory')}
                  className={iconInputClass}
                >
                  <option value="">Catégorie de service</option>
                  {SERVICE_CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              {shouldShowError('serviceCategory') && <p className="text-red-400 text-xs px-1 -mt-1">{errors.serviceCategory}</p>}

              <textarea
                rows={3}
                maxLength={200}
                placeholder="Description courte"
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
                onBlur={() => markTouched('description')}
                className={`${inputClass} resize-none`}
              />
              {shouldShowError('description') && <p className="text-red-400 text-xs px-1 -mt-1">{errors.description}</p>}

              <input
                type="number"
                min="1"
                placeholder="Tarif approximatif (MAD)"
                value={form.rate}
                onChange={e => updateField('rate', e.target.value)}
                onBlur={() => markTouched('rate')}
                className={inputClass}
              />
              {shouldShowError('rate') && <p className="text-red-400 text-xs px-1 -mt-1">{errors.rate}</p>}

              <label className="glass rounded-xl px-4 py-3 text-sm text-slate-400 flex items-center gap-2 cursor-pointer hover:border-teal/50 transition-all">
                <Image size={16} className="text-slate-400" />
                <span className="truncate">{form.photo?.name || 'Photo de profil'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => updateField('photo', e.target.files?.[0] || null)}
                  onBlur={() => markTouched('photo')}
                  className="hidden"
                />
              </label>
              {shouldShowError('photo') && <p className="text-red-400 text-xs px-1 -mt-1">{errors.photo}</p>}
            </>
          )}

          <label className="flex items-start gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={e => updateField('terms', e.target.checked)}
              onBlur={() => markTouched('terms')}
              className="mt-0.5 accent-teal"
            />
            <span>J'accepte les conditions d'utilisation</span>
          </label>
          {shouldShowError('terms') && <p className="text-red-400 text-xs px-1 -mt-1">{errors.terms}</p>}

          <button
            type="submit"
            disabled={!formIsValid}
            className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200
              flex items-center justify-center gap-2 mt-1
              ${!formIsValid
                ? 'bg-slate-700 cursor-not-allowed'
                : 'gradient-orange shadow-orange hover:opacity-90 hover:scale-[1.02] active:scale-95'}`}
          >
            <CheckCircle size={17} /> Créer mon compte
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5 animate-fadeInUp anim-delay-3">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-teal font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

function PasswordField({ value, placeholder, show, onToggle, onChange, onBlur }) {
  return (
    <div className="relative">
      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full glass rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500
          outline-none focus:border-teal/50 transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}
