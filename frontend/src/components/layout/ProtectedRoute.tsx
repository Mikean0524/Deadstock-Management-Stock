import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { Role } from '../../types/auth'

interface ProtectedRouteProps {
  roles?: Role[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) return <p className="p-6">Loading...</p>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && (!user || !roles.includes(user.role))) return <Navigate to="/" replace />

  return <Outlet />
}
