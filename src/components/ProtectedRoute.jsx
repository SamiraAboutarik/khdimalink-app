import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function ProtectedRoute({ children, role, requiredRole }) {
  const { user } = useApp()
  const allowedRole = role || requiredRole

  if (!user) return <Navigate to="/login" replace />
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />

  return children
}
