import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AdminReviewPage, BuyerMarketplacePage } from './features/person3/Person3PrototypePages'
import { InventoryPage } from './pages/InventoryPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { VendorDashboardPage } from './pages/VendorDashboardPage'
import { useAuth } from './context/AuthContext'

function IndexRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) return <LoadingScreen />
  return <Navigate to={!isAuthenticated ? '/login' : user?.role === 'BUYER' ? '/marketplace' : '/dashboard'} replace />
}

function LoadingScreen() {
  return <div className="intro-screen grid min-h-svh place-items-center overflow-hidden bg-slate-950 p-6"><div className="relative text-center text-white"><div className="intro-orbit absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" /><div className="intro-orbit intro-orbit-two absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-300/15" /><div className="relative mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-indigo-400 via-violet-400 to-cyan-300 text-4xl text-slate-950 shadow-2xl shadow-indigo-500/40">◈</div><p className="relative text-3xl font-bold tracking-tight">deadstock<span className="text-cyan-300">.</span></p><p className="relative mt-3 text-sm tracking-wide text-slate-400">giving surplus a second story</p><div className="relative mx-auto mt-8 h-1.5 w-52 overflow-hidden rounded-full bg-white/10"><div className="intro-progress h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" /></div></div></div>
}

function App() {
  const { isLoading } = useAuth()
  const [introComplete, setIntroComplete] = useState(false)
  useEffect(() => { const timer = window.setTimeout(() => setIntroComplete(true), 2200); return () => window.clearTimeout(timer) }, [])
  if (isLoading || !introComplete) return <LoadingScreen />
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AppLayout />}>
        <Route path="/marketplace" element={<BuyerMarketplacePage />} />

        <Route element={<ProtectedRoute roles={['VENDOR', 'ADMIN']} />}>
          <Route path="/dashboard" element={<VendorDashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminReviewPage />} />
        </Route>

        <Route path="/" element={<IndexRedirect />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
