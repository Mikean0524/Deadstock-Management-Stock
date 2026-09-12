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
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

function App() {
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
