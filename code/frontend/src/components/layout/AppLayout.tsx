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
      <header className="sticky top-0 z-10 border-b border-white/60 bg-white/80 px-5 py-3 backdrop-blur-xl sm:px-8">
       <div className="mx-auto flex max-w-7xl items-center gap-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 font-bold text-white shadow-lg shadow-indigo-500/25">◈</span><span className="font-bold tracking-tight text-slate-950">deadstock<span className="text-indigo-600">.</span></span>
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
          <span className="hidden text-slate-600 sm:inline">
            {user?.name} <span className="text-slate-400">({user?.role})</span>
          </span>
          <Button type="button" variant="secondary" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div></header>
      <main className="mx-auto max-w-7xl p-5 sm:p-8">
        <Outlet />
      </main>
    </div>
  )
}
