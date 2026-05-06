const AUTH_KEY = 'khedmalink_auth'

export function login(email) {
  const auth = {
    token: 'mock-token',
    user: { email },
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  return auth
}

export function logout() {
  localStorage.clear()
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
