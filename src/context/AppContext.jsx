import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(null)           // null = not logged in
  const [role, setRole] = useState(null)           // 'client' | 'artisan'

  // UI state
  const [darkMode, setDarkMode] = useState(true)  // dark by default
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Bookings state
  const [bookings, setBookings] = useState([])

  const login = (userData, userRole) => {
    setUser(userData)
    setRole(userRole)
  }

  const logout = () => {
    setUser(null)
    setRole(null)
  }

  const addBooking = (booking) => {
    setBookings(prev => [...prev, { ...booking, id: Date.now() }])
  }

  return (
    <AppContext.Provider value={{
      user, role, login, logout,
      darkMode, setDarkMode,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      bookings, addBooking,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
