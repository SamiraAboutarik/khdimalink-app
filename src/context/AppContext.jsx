import { createContext, useContext, useEffect, useState } from 'react'
import { getAuth, isAuthenticated, login as mockLogin, logout as mockLogout } from '../lib/mockAuth'

const AppContext = createContext(null)
const PROFILE_KEY = 'khedmalink_profile'
const BOOKINGS_KEY = 'khedmalink_bookings'

export const T = {
  fr: {
    dir: 'ltr',
    appTagline: 'Services a domicile au Maroc',
    iam_client: 'Je suis client',
    iam_artisan: 'Je suis prestataire de service',
    login: 'Connexion',
    signup: 'Inscription',
    phone: 'Numero de telephone',
    phonePlaceholder: '06 12 34 56 78',
    password: 'Mot de passe',
    fullname: 'Nom complet',
    connect: 'Se connecter',
    create_account: 'Creer mon compte',
    demo_hint: 'Entrez votre adresse email',
    error_fields: 'Veuillez remplir tous les champs.',
    error_phone: 'Email invalide.',
    nav_home: 'Accueil',
    nav_map: 'Carte',
    nav_chat: 'Messages',
    nav_bookings: 'Reservations',
    nav_profile: 'Profil',
    nav_dashboard: 'Dashboard',
    nav_missions: 'Missions',
    discuss: 'Discuter',
    book: 'Reserver ce service',
    pay_online: 'Payer en ligne',
    artisan_nearby: 'Artisans pres de vous',
  },
  ar: {
    dir: 'rtl',
    appTagline: 'Services a domicile au Maroc',
    iam_client: 'Client',
    iam_artisan: 'Artisan',
    login: 'Connexion',
    signup: 'Inscription',
    phone: 'Email',
    phonePlaceholder: 'email@example.com',
    password: 'Mot de passe',
    fullname: 'Nom complet',
    connect: 'Se connecter',
    create_account: 'Creer mon compte',
    demo_hint: 'Entrez votre adresse email',
    error_fields: 'Veuillez remplir tous les champs.',
    error_phone: 'Email invalide.',
    nav_home: 'Accueil',
    nav_map: 'Carte',
    nav_chat: 'Messages',
    nav_bookings: 'Reservations',
    nav_profile: 'Profil',
    nav_dashboard: 'Dashboard',
    nav_missions: 'Missions',
    discuss: 'Discuter',
    book: 'Reserver ce service',
    pay_online: 'Payer en ligne',
    artisan_nearby: 'Artisans pres de vous',
  },
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback
  } catch {
    return fallback
  }
}

function getStoredProfile() {
  return {
    id: 'mock-user',
    name: 'Utilisateur',
    phone: '',
    city: 'Agadir',
    role: 'client',
    lang: 'fr',
    ...readJson(PROFILE_KEY, {}),
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [lang, setLang] = useState('fr')
  const [darkMode, setDarkMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const t = T[lang]

  useEffect(() => {
    if (isAuthenticated()) {
      const auth = getAuth()
      const profile = getStoredProfile()

      setUser({
        id: profile.id,
        email: auth?.user?.email || '',
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        role: profile.role,
      })
      setRole(profile.role)
      setLang(profile.lang)
      setBookings(readJson(BOOKINGS_KEY, []))
    }

    setLoading(false)
  }, [])

  const login = (userData, userRole = 'client') => {
    const email = userData.email
    mockLogin(email)

    const profile = {
      id: userData.id || `mock-user-${Date.now()}`,
      name: userData.name || email.split('@')[0] || 'Utilisateur',
      phone: userData.phone || '',
      city: userData.city || 'Agadir',
      role: userRole,
      lang,
    }

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    setUser({ ...profile, email })
    setRole(userRole)
  }

  const logout = () => {
    mockLogout()
    localStorage.removeItem(PROFILE_KEY)
    localStorage.removeItem(BOOKINGS_KEY)
    setUser(null)
    setRole(null)
    setBookings([])
  }

  const addBooking = async (booking) => {
    if (!user) return { data: null, error: new Error('Utilisateur non connecte') }

    const data = {
      id: crypto.randomUUID(),
      client_id: user.id,
      artisan_id: booking.artisanId,
      artisanName: booking.artisanName,
      service_type: booking.service,
      date: booking.date,
      time_slot: booking.time,
      location: booking.location,
      note: booking.note,
      status: 'pending',
      price_label: 'A definir',
      created_at: new Date().toISOString(),
    }

    setBookings(prev => {
      const next = [data, ...prev]
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next))
      return next
    })

    return { data, error: null }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#060B18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#0ABFBC', fontSize: 24, fontWeight: 800, letterSpacing: -1 }}>
            Khdima<span style={{ color: '#fff' }}>Link</span>
          </p>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={{
      user, role, login, logout, isAuthenticated,
      lang, t,
      darkMode, setDarkMode,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      bookings, addBooking,
    }}>
      <div dir={t.dir} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
