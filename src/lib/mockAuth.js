const AUTH_KEY = 'khedmalink_auth'
export const REGISTERED_USERS_KEY = 'khedmalink-users'

export const MOCK_ADMIN_USER = {
  phone: '0600000000',
  password: 'Admin123',
  role: 'admin',
  nom: 'Admin KhdimaLink',
  email: 'admin@khdimalink.local',
}

export const MOCK_PROVIDER_USER = {
  phone: '0611111111',
  password: 'Prestataire123',
  role: 'prestataire',
  nom: 'Youssef El Fassi',
  email: 'prestataire@khdimalink.local',
}

export const normalizePhone = (phone = '') => {
  const cleanPhone = phone.replace(/[\s.-]/g, '')
  return cleanPhone.replace(/^\+212([567]\d{8})$/, '0$1')
}

export function getRegisteredUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY))
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

export function getLoginResult(phone, password) {
  const cleanPhone = normalizePhone(phone)
  const users = [MOCK_ADMIN_USER, MOCK_PROVIDER_USER, ...getRegisteredUsers()]
  const user = users.find(item => normalizePhone(item.phone) === cleanPhone)

  if (!user) {
    return { user: null, error: 'Numéro introuvable. Veuillez vous inscrire.' }
  }

  if (user.password !== password) {
    return { user: null, error: 'Mot de passe incorrect.' }
  }

  return { user, error: '' }
}

export function getMockUserByCredentials(phone, password) {
  return getLoginResult(phone, password).user
}

export function login(email, user = { email }) {
  const auth = {
    token: 'mock-token',
    user,
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  return auth
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY))
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getAuth()?.token)
}
