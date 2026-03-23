import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Login          from './pages/Login'
import Home           from './pages/Home'
import ArtisanProfile from './pages/ArtisanProfile'
import Booking        from './pages/Booking'
import Bookings       from './pages/Bookings'
import Chat           from './pages/Chat'
import Rating         from './pages/Rating'
import Dashboard      from './pages/Dashboard'
import Profile        from './pages/Profile'

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login"        element={<Login />} />
        <Route path="/"             element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/artisan/:id"  element={<ProtectedRoute><ArtisanProfile /></ProtectedRoute>} />
        <Route path="/booking/:id"  element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/bookings"     element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/chat"         element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/rating/:id"   element={<ProtectedRoute><Rating /></ProtectedRoute>} />
        <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  )
}
