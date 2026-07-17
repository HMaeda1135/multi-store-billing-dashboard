import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Layout } from '../components/layout/Layout'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { TransactionListPage } from '../pages/TransactionListPage'
import { TransactionFormPage } from '../pages/TransactionFormPage'
import { TransactionDetailPage } from '../pages/TransactionDetailPage'
import { StoreListPage } from '../pages/StoreListPage'
import { VendorListPage } from '../pages/VendorListPage'
import { ProtectedRoute, AdminRoute } from './ProtectedRoute'

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'admin' ? '/dashboard' : '/transactions'} replace />
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<RootRedirect />} />
            <Route element={<AdminRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="stores" element={<StoreListPage />} />
              <Route path="vendors" element={<VendorListPage />} />
            </Route>
            <Route path="transactions" element={<TransactionListPage />} />
            <Route path="transactions/new" element={<TransactionFormPage />} />
            <Route path="transactions/:id" element={<TransactionDetailPage />} />
            <Route path="transactions/:id/edit" element={<TransactionFormPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
