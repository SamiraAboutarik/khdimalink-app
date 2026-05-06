import { createContext, useContext, useEffect, useState } from 'react'
import { getAuth, isAuthenticated, login as mockLogin, logout as mockLogout } from '../lib/mockAuth'

const AppContext = createContext(null)
const PROFILE_KEY = 'khedmalink_profile'
const BOOKINGS_KEY = 'khedmalink-bookings'
const LEGACY_BOOKINGS_KEY = 'khedmalink_bookings'
const FAVORITES_KEY = 'khedmalink-favorites'
const REVIEWS_KEY = 'khedmalink-reviews'
const ADDRESSES_KEY = 'khedmalink-addresses'
const CHAT_KEY = 'khedmalink-chat'

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

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
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
  const [favorites, setFavorites] = useState([])
  const [reviews, setReviews] = useState([])
  const [addresses, setAddresses] = useState([])
  const [chatThreads, setChatThreads] = useState([])
  const [toast, setToast] = useState('')
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
    }

    const storedBookings = readJson(BOOKINGS_KEY, null) || readJson(LEGACY_BOOKINGS_KEY, [])
    setBookings(storedBookings)
    setFavorites(readJson(FAVORITES_KEY, []).map(String))
    setReviews(readJson(REVIEWS_KEY, []))
    setAddresses(readJson(ADDRESSES_KEY, []))
    setChatThreads(readJson(CHAT_KEY, []))
    setLoading(false)
  }, [])

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const login = (userData, userRole = 'client') => {
    const authenticatedRole = userData.role || userRole || 'client'
    const email = userData.email
    mockLogin(email, { email, phone: userData.phone, role: authenticatedRole, name: userData.name })

    const profile = {
      id: userData.id || `mock-user-${Date.now()}`,
      name: userData.name || email.split('@')[0] || 'Utilisateur',
      phone: userData.phone || '',
      city: userData.city || 'Agadir',
      role: authenticatedRole,
      lang,
    }

    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    setUser({ ...profile, email })
    setRole(authenticatedRole)

    return { ...profile, email }
  }

  const logout = () => {
    mockLogout()
    localStorage.removeItem(PROFILE_KEY)
    setUser(null)
    setRole(null)
  }

  const createBooking = async (booking) => {
    if (!user) return { data: null, error: new Error('Utilisateur non connecte') }

    const data = {
      id: crypto.randomUUID(),
      client_id: user.id,
      artisan_id: booking.artisanId,
      artisanId: booking.artisanId,
      artisanName: booking.artisanName,
      artisanAvatar: booking.artisanAvatar || '',
      artisanCategory: booking.artisanCategory || '',
      service_type: booking.service,
      service: booking.service,
      date: booking.date,
      time_slot: booking.time,
      time: booking.time,
      location: booking.location,
      addressId: booking.addressId || '',
      note: booking.note,
      status: 'pending',
      paymentStatus: 'unpaid',
      amount: booking.amount || 250,
      price_label: `${booking.amount || 250} MAD`,
      created_at: new Date().toISOString(),
    }

    setBookings(prev => {
      const next = [data, ...prev]
      writeJson(BOOKINGS_KEY, next)
      return next
    })
    showToast('Reservation creee')

    return { data, error: null }
  }

  const updateBookingStatus = (bookingId, status, extra = {}) => {
    setBookings(prev => {
      const next = prev.map(booking => (
        String(booking.id) === String(bookingId)
          ? { ...booking, ...extra, status, updated_at: new Date().toISOString() }
          : booking
      ))
      writeJson(BOOKINGS_KEY, next)
      return next
    })
  }

  const cancelBooking = (bookingId) => {
    updateBookingStatus(bookingId, 'cancelled')
    showToast('Reservation annulee')
  }

  const toggleFavorite = (providerId) => {
    const id = String(providerId)
    let added = false
    setFavorites(prev => {
      const exists = prev.includes(id)
      added = !exists
      const next = exists ? prev.filter(item => item !== id) : [...prev, id]
      writeJson(FAVORITES_KEY, next)
      return next
    })
    showToast(added ? 'Ajoute aux favoris' : 'Retire des favoris')
  }

  const addReview = (review) => {
    const data = {
      id: crypto.randomUUID(),
      providerId: String(review.providerId),
      bookingId: review.bookingId,
      clientId: user?.id || 'mock-user',
      clientName: user?.name || 'Client',
      rating: review.rating,
      comment: review.comment,
      date: new Date().toISOString(),
    }

    setReviews(prev => {
      const next = [data, ...prev.filter(item => item.bookingId !== review.bookingId)]
      writeJson(REVIEWS_KEY, next)
      return next
    })
    showToast('Avis publie')
    return data
  }

  const saveAddress = (address) => {
    const data = {
      id: address.id || crypto.randomUUID(),
      label: address.label || 'Maison',
      text: address.text,
      city: address.city,
    }

    setAddresses(prev => {
      const next = address.id
        ? prev.map(item => item.id === address.id ? data : item)
        : [data, ...prev]
      writeJson(ADDRESSES_KEY, next)
      return next
    })
    showToast(address.id ? 'Adresse modifiee' : 'Adresse ajoutee')
  }

  const deleteAddress = (addressId) => {
    setAddresses(prev => {
      const next = prev.filter(address => address.id !== addressId)
      writeJson(ADDRESSES_KEY, next)
      return next
    })
    showToast('Adresse supprimee')
  }

  const getThread = (bookingId) => (
    chatThreads.find(thread => String(thread.bookingId) === String(bookingId)) || { bookingId, messages: [], unread: 0 }
  )

  const markThreadRead = (bookingId) => {
    setChatThreads(prev => {
      const next = prev.map(thread => (
        String(thread.bookingId) === String(bookingId) ? { ...thread, unread: 0 } : thread
      ))
      writeJson(CHAT_KEY, next)
      return next
    })
  }

  const sendChatMessage = (bookingId, text) => {
    const message = {
      id: crypto.randomUUID(),
      sender: 'client',
      text,
      timestamp: new Date().toISOString(),
    }

    setChatThreads(prev => {
      const existing = prev.find(thread => String(thread.bookingId) === String(bookingId))
      const next = existing
        ? prev.map(thread => String(thread.bookingId) === String(bookingId)
          ? { ...thread, messages: [...thread.messages, message] }
          : thread)
        : [...prev, { bookingId, messages: [message], unread: 0 }]
      writeJson(CHAT_KEY, next)
      return next
    })
    showToast('Message envoye')

    window.setTimeout(() => {
      const reply = {
        id: crypto.randomUUID(),
        sender: 'provider',
        text: 'Merci, je vous reponds bientot.',
        timestamp: new Date().toISOString(),
      }

      setChatThreads(prev => {
        const existing = prev.find(thread => String(thread.bookingId) === String(bookingId))
        const next = existing
          ? prev.map(thread => String(thread.bookingId) === String(bookingId)
            ? { ...thread, messages: [...thread.messages, reply], unread: (thread.unread || 0) + 1 }
            : thread)
          : [...prev, { bookingId, messages: [reply], unread: 1 }]
        writeJson(CHAT_KEY, next)
        return next
      })
    }, 1000)
  }

  const unreadMessages = chatThreads.reduce((total, thread) => total + (thread.unread || 0), 0)

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
      bookings, createBooking, addBooking: createBooking, cancelBooking, updateBookingStatus,
      favorites, toggleFavorite,
      reviews, addReview,
      addresses, saveAddress, deleteAddress,
      chatThreads, getThread, sendChatMessage, markThreadRead, unreadMessages,
      showToast,
    }}>
      <div dir={t.dir} style={{ minHeight: '100vh' }}>
        {children}
        {toast && (
          <div className="fixed left-1/2 top-16 z-[100] -translate-x-1/2 rounded-xl border border-teal/30 bg-[#07111f]/95 px-4 py-3 text-sm font-semibold text-teal shadow-card">
            {toast}
          </div>
        )}
      </div>
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
