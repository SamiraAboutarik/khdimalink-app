import ClientProfile from './ClientProfile'
import ProviderProfile from './ProviderProfile'
import { useApp } from '../context/AppContext'

export default function Profile() {
  const { user, role } = useApp()
  const currentRole = user?.role || role

  if (currentRole === 'prestataire' || currentRole === 'artisan') {
    return <ProviderProfile />
  }

  return <ClientProfile />
}
