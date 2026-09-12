import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive ? 'font-semibold text-indigo-600' : 'text-slate-600 hover:text-slate-900'
}

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-svh">
      <header className="flex items-center gap-6 border-b bg-white px-6 py-3">
        <span className="font-bold text-slate-900">Deadstock Portal</span>
        <nav className="flex flex-1 gap-4 text-sm">
          {(user?.role === 'VENDOR' || user?.role === 'ADMIN') && (
            <>
              <NavLink to="/dashboard" className={navLinkClassName}>
                Dashboard
              </NavLink>
              <NavLink to="/inventory" className={navLinkClassName}>
                Inventory
              </NavLink>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={navLinkClassName}>
              Admin queue
            </NavLink>
          )}
          <NavLink to="/marketplace" className={navLinkClassName}>
            Marketplace
          </NavLink>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600">
            {user?.name} <span className="text-slate-400">({user?.role})</span>
          </span>
          <Button type="button" variant="secondary" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
