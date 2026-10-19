import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import PageLoader from '@/components/PageLoader.jsx'

// Layout route: signed-in only by default, guests only with `guestOnly`
function AuthRoute({ guestOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader />
  if (guestOnly && user) return <Navigate to="/shelf" replace />
  if (!guestOnly && !user) return <Navigate to="/login" replace />
  return <Outlet />
}

export default AuthRoute
