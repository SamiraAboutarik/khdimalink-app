import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { useApp } from './context/AppContext'
import { useTheme } from './hooks/useTheme'

import Login          from './pages/Login'
import Register       from './pages/Register'
import Home           from './pages/Home'
import ArtisanProfile from './pages/ArtisanProfile'
import Booking        from './pages/Booking'
import Bookings       from './pages/Bookings'
import Chat           from './pages/Chat'
import Rating         from './pages/Rating'
import Dashboard      from './pages/Dashboard'
import Profile        from './pages/Profile'
import MapView        from './pages/MapView'
import Payment        from './pages/Payment'
import AdminLayout    from './pages/admin/AdminLayout'

function roleHomePath(role) {
  if (role === 'admin') return '/admin'
  if (role === 'prestataire') return '/dashboard'
  return '/'
}

function LoginRoute() {
  const { user } = useApp()
  if (user) return <Navigate to={roleHomePath(user.role)} replace />
  return <Login />
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login"        element={<LoginRoute />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/"             element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/artisan/:id"  element={<ProtectedRoute><ArtisanProfile /></ProtectedRoute>} />
        <Route path="/booking/:id"  element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/bookings"     element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/chat"         element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/rating/:id"   element={<ProtectedRoute><Rating /></ProtectedRoute>} />
        <Route path="/dashboard"    element={<ProtectedRoute role="prestataire"><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/map"          element={<ProtectedRoute><MapView /></ProtectedRoute>} />
        <Route path="/payment"      element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/admin/*"      element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  useTheme()

  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  )
}
