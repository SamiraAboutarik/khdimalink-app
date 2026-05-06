const AUTH_KEY = 'khedmalink_auth'

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

export function getMockUserByCredentials(phone, password) {
  const cleanPhone = phone.replace(/\s/g, '')
  const users = [MOCK_ADMIN_USER, MOCK_PROVIDER_USER]
  const user = users.find(item => cleanPhone === item.phone && password === item.password)
  if (user) return user
  return null
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
